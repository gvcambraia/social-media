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

  await prisma.post.create({
    data: {
      content: content.trim(),
      author_id: authorId,
    },
  });

  revalidatePath('/');
}
