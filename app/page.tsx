import { Feed } from '@/components/feed/Feed';
import { CreatePost } from '@/components/post/CreatePost';
import { UserSelector } from '@/components/user-selector/UserSelector';

export default function Home() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black'>
      <div className='flex min-h-screen items-start pt-16 mr-16'>
        <UserSelector />
      </div>
      <main className='flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start'>
        <div className='flex flex-col items-center w-full gap-6 text-center sm:items-start sm:text-left'>
          <CreatePost />
          <hr className='w-full border-t border-gray-300 dark:border-gray-700' />
          <Feed />
        </div>
      </main>
    </div>
  );
}
