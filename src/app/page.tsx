import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route'; // Adjust path if needed
import { redirect } from 'next/navigation';
import HomePage from '@/app/home/HomePage'; // Assuming this is your homepage content

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect('/dashboard');
  }

  return (
    <section className='p-0'>
      <HomePage />
    </section>
  );
}
