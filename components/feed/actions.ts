'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function repostPost(authorId: number, originalPostId: number) {
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

  await prisma.post.create({
    data: {
      content: originalPost.content,
      author_id: authorId,
      original_post_id: originalPostId,
    },
  });

  revalidatePath('/');
}

export async function loadMorePosts(skip: number) {
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
    },
    orderBy: {
      created_at: 'desc',
    },
    skip,
    take: 20,
  });

  return posts;
}
