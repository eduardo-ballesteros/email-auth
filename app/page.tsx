import EmailList from '@/components/EmailList';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Recent Emails</h1>
      <EmailList />
    </div>
  );
}