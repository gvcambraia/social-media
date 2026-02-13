'use client';

import dayjs from 'dayjs';
import { Card, CardContent, CardHeader } from '../ui/card';

type FeedItemProps = {
  post: {
    id: number;
    content: string;
    created_at: Date;
    author: {
      id: number;
      username: string;
    };
  };
};

export function FeedItem({ post }: FeedItemProps) {
  const formattedDate = dayjs(post.created_at).format('MMM D, YYYY h:mm A');

  return (
    <Card>
      <CardHeader className='pb-3'>
        <div className='flex items-center justify-between'>
          <p className='text-sm font-medium'>@{post.author.username}</p>
          <p className='text-xs text-muted-foreground'>{formattedDate}</p>
        </div>
      </CardHeader>
      <CardContent>
        <p className='text-sm'>{post.content}</p>
      </CardContent>
    </Card>
  );
}
