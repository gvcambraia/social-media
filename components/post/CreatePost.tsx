'use client';

import { useAuth } from '@/lib/context/AuthContext';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { createPost } from './actions';

export function CreatePost() {
  const auth = useAuth();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!auth.currentUser) {
      alert('Please select a user first');
      return;
    }

    if (!content.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await createPost(auth.currentUser.id, content);
      setContent('');
    } catch (error) {
      console.error('Failed to create post:', error);
      alert('Failed to create post');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='flex flex-col w-full gap-4'>
      <div className='flex flex-col gap-2'>
        <Label htmlFor='content'>Create a post</Label>
        <Textarea
          id='content'
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={777}
          rows={4}
          disabled={!auth.currentUser || isSubmitting}
        />
        <p className='text-xs text-muted-foreground'>
          {content.length}/777 characters
        </p>
      </div>
      <Button
        type='submit'
        disabled={!auth.currentUser || !content.trim() || isSubmitting}
      >
        {isSubmitting ? 'Posting...' : 'Post'}
      </Button>
    </form>
  );
}
