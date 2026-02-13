import { UserSelector } from '@/components/user-selector/UserSelector';

export default function Home() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black'>
      <div className='flex min-h-screen items-start pt-16 mr-16'>
        <UserSelector />
      </div>
      <main className='flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start'>
        <div className='flex flex-col items-center gap-6 text-center sm:items-start sm:text-left'>
          Feed + Add post
        </div>
      </main>
    </div>
  );
}
