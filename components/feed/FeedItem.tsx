'use client';

import { useAuth } from '@/lib/context/AuthContext';
import dayjs from 'dayjs';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader } from '../ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { repostPost } from './actions';

type FeedItemProps = {
  post: {
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
    reposts: {
      author_id: number;
    }[];
  };
};

export function FeedItem({ post }: FeedItemProps) {
  const auth = useAuth();
  const [isReposting, setIsReposting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const isRepost = post.original_post_id !== null;
  const displayPost =
    isRepost && post.original_post ? post.original_post : post;
  const formattedDate = dayjs(post.created_at).format('MMM D, YYYY h:mm A');
  const originalFormattedDate =
    isRepost && post.original_post
      ? dayjs(post.original_post.created_at).format('MMM D, YYYY h:mm A')
      : null;
  const isOwnPost = auth.currentUser?.id === displayPost.author.id;

  const hasUserReposted =
    auth.currentUser && !isRepost
      ? post.reposts.some(
          (r: { author_id: number }) => r.author_id === auth.currentUser?.id,
        )
      : false;

  const handleRepostClick = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmRepost = async () => {
    if (!auth.currentUser) {
      alert('Please select a user first');
      return;
    }

    setIsReposting(true);
    setShowConfirmDialog(false);

    try {
      await repostPost(auth.currentUser.id, displayPost.id);
    } catch (error) {
      console.error('Failed to repost:', error);
      alert(error instanceof Error ? error.message : 'Failed to repost');
    } finally {
      setIsReposting(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader className='pb-3'>
          {isRepost && (
            <p className='text-xs text-muted-foreground mb-2'>
              Reposted by @{post.author.username} • {formattedDate}
            </p>
          )}
          <div className='flex items-center justify-between'>
            <p className='text-sm font-medium'>
              @{displayPost.author.username}
            </p>
            <p className='text-xs text-muted-foreground'>
              {isRepost ? originalFormattedDate : formattedDate}
            </p>
          </div>
        </CardHeader>
        <CardContent className='space-y-3'>
          <p className='text-sm'>{displayPost.content}</p>
          {!isOwnPost && (
            <Button
              variant='outline'
              size='sm'
              onClick={handleRepostClick}
              disabled={
                !auth.currentUser || isRepost || isReposting || hasUserReposted
              }
            >
              {isReposting
                ? 'Reposting...'
                : hasUserReposted
                  ? 'Already reposted'
                  : 'Repost'}
            </Button>
          )}
        </CardContent>
      </Card>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Repost</DialogTitle>
            <DialogDescription>
              Are you sure you want to repost this post from @
              {displayPost.author.username}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setShowConfirmDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleConfirmRepost}>Confirm Repost</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
