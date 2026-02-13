'use client';

import { useEffect, useRef, useState } from 'react';
import { Input } from '../ui/input';
import { loadMorePosts } from './actions';
import { FeedItem } from './FeedItem';

type Post = {
  id: number;
  content: string;
  created_at: Date;
  original_post_id: number | null;
  author: {
    id: number;
    username: string;
  };
  original_post: {
    id: number;
    content: string;
    created_at: Date;
    author: {
      id: number;
      username: string;
    };
  } | null;
};

type FeedListProps = {
  initialPosts: Post[];
};

export function FeedList({ initialPosts }: FeedListProps) {
  const [search, setSearch] = useState('');
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialPosts.length === 15);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const filteredPosts = posts.filter((post) => {
    if (!search.trim()) return true;

    const searchLower = search.toLowerCase();
    const contentMatch = post.content.toLowerCase().includes(searchLower);
    const authorMatch = post.author.username
      .toLowerCase()
      .includes(searchLower);
    const originalContentMatch =
      post.original_post?.content.toLowerCase().includes(searchLower) ?? false;
    const originalAuthorMatch =
      post.original_post?.author.username.toLowerCase().includes(searchLower) ??
      false;

    return (
      contentMatch || authorMatch || originalContentMatch || originalAuthorMatch
    );
  });

  useEffect(() => {
    if (!hasMore || isLoading) return;

    const observer = new IntersectionObserver(
      async (entries) => {
        if (entries[0].isIntersecting) {
          setIsLoading(true);
          try {
            const newPosts = await loadMorePosts(posts.length);
            if (newPosts.length < 20) {
              setHasMore(false);
            }
            setPosts((prev) => [...prev, ...newPosts]);
          } catch (error) {
            console.error('Failed to load more posts:', error);
          } finally {
            setIsLoading(false);
          }
        }
      },
      { threshold: 0.1 },
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasMore, isLoading, posts.length]);

  return (
    <div className='flex flex-col w-full gap-4'>
      <Input
        type='text'
        placeholder='Search posts...'
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className='w-full'
      />
      {filteredPosts.length === 0 ? (
        <p className='text-muted-foreground'>
          {search.trim() ? 'No posts found' : 'No posts yet'}
        </p>
      ) : (
        <>
          {filteredPosts.map((post) => (
            <FeedItem key={post.id} post={post} />
          ))}
          {hasMore && !search.trim() && (
            <div ref={loadMoreRef} className='py-4 text-center'>
              {isLoading ? (
                <p className='text-sm text-muted-foreground'>
                  Loading more posts...
                </p>
              ) : (
                <p className='text-sm text-muted-foreground'>Scroll for more</p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
