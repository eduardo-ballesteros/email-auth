'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Avatar } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';

interface Email {
  id: string;
  subject: string;
  from: { emailAddress: { name: string; address: string } };
  receivedDateTime: string;
}

export default function EmailList() {
  const { data: session } = useSession();
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEmails() {
      if (session) {
        try {
          const response = await fetch('/api/emails');
          if (response.ok) {
            const data = await response.json();
            setEmails(data);
          } else {
            console.error('Failed to fetch emails');
          }
        } catch (error) {
          console.error('Error fetching emails:', error);
        } finally {
          setLoading(false);
        }
      }
    }

    fetchEmails();
  }, [session]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <div>Please sign in to view your emails.</div>;
  }

  return (
    <div className="space-y-4">
      {emails.map((email) => (
        <Card key={email.id} className="p-4">
          <div className="flex items-center space-x-4">
            <Avatar>
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold">
                {email.from.emailAddress.name.charAt(0).toUpperCase()}
              </div>
            </Avatar>
            <div className="flex-grow">
              <h3 className="font-semibold">{email.subject}</h3>
              <p className="text-sm text-gray-600">{email.from.emailAddress.name}</p>
            </div>
            <div className="text-sm text-gray-500">
              {formatDistanceToNow(new Date(email.receivedDateTime), { addSuffix: true })}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}