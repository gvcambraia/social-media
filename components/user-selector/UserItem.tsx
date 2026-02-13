'use client';
import { User } from '@/app/generated/prisma/client';
import { useAuth } from '@/lib/context/AuthContext';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

export function UserItem({ users }: { users: User[] }) {
  const auth = useAuth();
  return (
    <Select>
      <SelectTrigger className='w-full max-w-48'>
        <SelectValue
          placeholder={auth.currentUser?.username ?? 'Select User'}
        />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {users.map((user) => (
            <SelectItem
              key={user.id}
              value={user.username}
              onChange={() => auth.setCurrentUser(user)}
            >
              {user.username}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
