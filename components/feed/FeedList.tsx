'use client';

import { useState } from 'react';
import { Input } from '../ui/input';
import { FeedItem } from './FeedItem';

type FeedListProps = {
  posts: {
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
  }[];
};

export function FeedList({ posts }: FeedListProps) {
  const [search, setSearch] = useState('');

  const filteredPosts = posts.filter((post) => {
    if (!search.trim()) return true;

    const searchLower = search.toLowerCase();
    const contentMatch = post.content.toLowerCase().includes(searchLower);
    const authorMatch = post.author.username.toLowerCase().includes(searchLower);
    const originalContentMatch =
      post.original_post?.content.toLowerCase().includes(searchLower) ?? false;
    const originalAuthorMatch =
      post.original_post?.author.username.toLowerCase().includes(searchLower) ??
      false;

    return (
      contentMatch ||
      authorMatch ||
      originalContentMatch ||
      originalAuthorMatch
    );
  });

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
        filteredPosts.map((post) => <FeedItem key={post.id} post={post} />)
      )}
    </div>
  );
}
