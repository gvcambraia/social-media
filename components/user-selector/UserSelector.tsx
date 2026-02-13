import prisma from '@/lib/prisma';
import { UserItem } from './UserItem';

export async function UserSelector() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
    },
    orderBy: {
      id: 'asc',
    },
  });

  return (
    <div className='flex flex-col gap-2'>
      <UserItem users={users} />
    </div>
  );
}
