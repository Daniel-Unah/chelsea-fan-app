import { supabase } from '@/lib/supabaseClient';

export default async function Home() {
  const { count, error } = await supabase.from('news').select('*', { count: 'exact', head: true });
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-24">
      <div className="bg-blue-600 text-white p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-4">Welcome to Chelsea Fan App</h1>
        <p className="text-lg">Your ultimate destination for Chelsea FC news and updates</p>
        <p className="mt-4">Supabase test query result: {error ? 'Error: ' + error.message : `Count: ${count}`}</p>
      </div>
    </main>
  );
}
