'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createPost(authorId: number, content: string) {
  if (!content.trim()) {
    throw new Error('Content cannot be empty');
  }

  if (content.length > 777) {
    throw new Error('Content exceeds maximum length of 777 characters');
  }

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

  await prisma.post.create({
    data: {
      content: content.trim(),
      author_id: authorId,
    },
  });

  revalidatePath('/');
}
