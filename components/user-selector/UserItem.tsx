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

  const handleValueChange = (username: string) => {
    const user = users.find((u) => u.username === username);
    if (user) {
      auth.setCurrentUser(user);
    }
  };

  return (
    <Select onValueChange={handleValueChange}>
      <SelectTrigger className='w-full max-w-48'>
        <SelectValue
          placeholder={auth.currentUser?.username ?? 'Select User'}
        />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {users.map((user) => (
            <SelectItem key={user.id} value={user.username}>
              {user.username}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
