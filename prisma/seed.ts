import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';
import { Prisma, PrismaClient } from '../app/generated/prisma/client';

const adapter = new PrismaPg({
  connectionString: process.env.DB_DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

const userData: Prisma.UserCreateInput[] = [
  {
    username: 'gabriel_one',
    posts: {},
  },
  {
    username: 'gabriel_two',
    posts: {},
  },
  {
    username: 'gabriel_three',
    posts: {},
  },
  {
    username: 'gabriel_four',
    posts: {},
  },
];

export async function main() {
  for (const u of userData) {
    await prisma.user.create({ data: u });
  }
}

main();
