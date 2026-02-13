'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function repostPost(authorId: number, originalPostId: number) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const postsToday = await prisma.post.count({
    where: {
      author_id: authorId,
      created_at: {
        gte: today,
        lt: tomorrow,
      },
    },
  });

  if (postsToday >= 5) {
    throw new Error('You have reached the maximum of 5 posts per day');
  }

  const originalPost = await prisma.post.findUnique({
    where: { id: originalPostId },
    select: {
      id: true,
      original_post_id: true,
      content: true,
    },
  });

  if (!originalPost) {
    throw new Error('Original post not found');
  }

  if (originalPost.original_post_id !== null) {
    throw new Error('Cannot repost a repost');
  }

  const existingRepost = await prisma.post.findFirst({
    where: {
      author_id: authorId,
      original_post_id: originalPostId,
    },
  });

  if (existingRepost) {
    throw new Error('You have already reposted this post');
  }

  await prisma.post.create({
    data: {
      content: originalPost.content,
      author_id: authorId,
      original_post_id: originalPostId,
    },
  });

  revalidatePath('/');
}

export async function loadMorePosts(
  skip: number,
  sortBy: 'latest' | 'trending' = 'latest',
) {
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
    orderBy: sortBy === 'latest' ? { created_at: 'desc' } : undefined,
    skip,
    take: 20,
  });

  if (sortBy === 'trending') {
    return posts.sort((a, b) => b.reposts.length - a.reposts.length);
  }

  return posts;
}

export async function loadInitialPosts(
  sortBy: 'latest' | 'trending' = 'latest',
) {
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
    orderBy: sortBy === 'latest' ? { created_at: 'desc' } : undefined,
    take: 15,
  });

  if (sortBy === 'trending') {
    return posts.sort((a, b) => b.reposts.length - a.reposts.length);
  }

  return posts;
}
