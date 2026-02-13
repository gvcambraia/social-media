import prisma from '@/lib/prisma';
import { FeedItem } from './FeedItem';

export async function Feed() {
  const posts = await prisma.post.findMany({
    select: {
      id: true,
      content: true,
      created_at: true,
      author: {
        select: {
          id: true,
          username: true,
        },
      },
    },
    orderBy: {
      created_at: 'desc',
    },
  });

  return (
    <div className='flex flex-col gap-4'>
      {posts.length === 0 ? (
        <p className='text-muted-foreground'>No posts yet</p>
      ) : (
        posts.map((post) => <FeedItem key={post.id} post={post} />)
      )}
    </div>
  );
}
