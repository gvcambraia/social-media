import prisma from '@/lib/prisma';
import { FeedList } from './FeedList';

export async function Feed() {
  const posts = await prisma.post.findMany({
    select: {
      id: true,
      content: true,
      created_at: true,
      original_post_id: true,
      author: {
        select: {
          id: true,
          username: true,
        },
      },
      original_post: {
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
      },
      reposts: {
        select: {
          author_id: true,
        },
      },
    },
    orderBy: {
      created_at: 'desc',
    },
    take: 15,
  });

  return <FeedList initialPosts={posts} />;
}
