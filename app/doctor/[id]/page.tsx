'use client';

import PublicProfile from '@/components/profile/public-profile';

interface DoctorProfilePageProps {
  params: {
    id: string;
  };
}

export default function DoctorProfilePage({ params }: DoctorProfilePageProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <PublicProfile ipfsHash={params.id} />
    </div>
  );
}
