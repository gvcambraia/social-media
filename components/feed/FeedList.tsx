'use client';

import { useEffect, useRef, useState } from 'react';
import { Input } from '../ui/input';
import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group';
import { loadInitialPosts, loadMorePosts } from './actions';
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
  const [sortBy, setSortBy] = useState<'latest' | 'trending'>('latest');
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialPosts.length === 15);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadPosts = async () => {
      setIsLoading(true);
      try {
        const newPosts = await loadInitialPosts(sortBy);
        setPosts(newPosts);
        setHasMore(newPosts.length === 15);
      } catch (error) {
        console.error('Failed to load posts:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadPosts();
  }, [sortBy]);

  const filteredPosts = posts.filter((post) => {
    if (!search.trim()) return true;

    if (post.original_post_id !== null) return false;

    const searchValue = search.trim();
    const contentMatch = post.content === searchValue;

    return contentMatch;
  });

  useEffect(() => {
    if (!hasMore || isLoading || search.trim()) return;

    const observer = new IntersectionObserver(
      async (entries) => {
        if (entries[0].isIntersecting) {
          setIsLoading(true);
          try {
            const newPosts = await loadMorePosts(posts.length, sortBy);
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
  }, [hasMore, isLoading, posts.length, sortBy, search]);

  return (
    <div className='flex flex-col w-full gap-4'>
      <div className='flex flex-col gap-2'>
        <Input
          type='text'
          placeholder='Search posts (exact match)...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className='w-full'
        />
        <ToggleGroup
          type='single'
          value={sortBy}
          onValueChange={(value) => {
            if (value) setSortBy(value as 'latest' | 'trending');
          }}
          className='justify-start'
        >
          <ToggleGroupItem value='latest' aria-label='Sort by latest'>
            Latest
          </ToggleGroupItem>
          <ToggleGroupItem value='trending' aria-label='Sort by trending'>
            Trending
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
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
