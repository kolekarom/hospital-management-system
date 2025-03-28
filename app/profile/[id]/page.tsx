'use client';

import PublicProfile from '@/components/profile/public-profile';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import IPFSViewer from '@/components/ipfs/ipfs-viewer';
import EnhancedChat from '@/components/chat/enhanced-chat';
import { getFromIPFS } from '@/utils/ipfs-pinata';

interface ProfilePageProps {
  params: {
    id: string;
  };
}

async function getProfileData(id: string) {
  // Fetch profile data from your database
  // This should include the IPFS CID for the profile data
  const profileCID = ''; // Get this from your database
  
  if (!profileCID) {
    return notFound();
  }

  try {
    const profileData = await getFromIPFS(profileCID);
    return profileData;
  } catch (error) {
    console.error('Error fetching profile data:', error);
    return notFound();
  }
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const profile = await getProfileData(params.id);

  return (
    <div className="container mx-auto py-8 space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              {profile.profileImage ? (
                <IPFSViewer 
                  initialCID={profile.profileImage.cid} 
                  showInput={false} 
                />
              ) : (
                <Avatar className="w-32 h-32">
                  <AvatarFallback>{profile.name[0]}</AvatarFallback>
                </Avatar>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <h1 className="text-2xl font-bold">{profile.name}</h1>
                <p className="text-gray-500">{profile.specialization || 'Patient'}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {profile.department && (
                  <Badge variant="secondary">
                    {profile.department}
                  </Badge>
                )}
                {profile.qualification && (
                  <Badge variant="secondary">
                    {profile.qualification}
                  </Badge>
                )}
                {profile.experience && (
                  <Badge variant="secondary">
                    {profile.experience} years experience
                  </Badge>
                )}
              </div>

              <div className="space-y-2">
                <p><strong>Email:</strong> {profile.email}</p>
                <p><strong>Phone:</strong> {profile.phone}</p>
                <p><strong>Address:</strong> {profile.address}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="about">
        <TabsList>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="chat">Chat</TabsTrigger>
        </TabsList>

        <TabsContent value="about">
          <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                {profile.bio}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.documents?.map((doc: any, index: number) => (
                  <IPFSViewer 
                    key={index}
                    initialCID={doc.cid}
                    showInput={false}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chat">
          <Suspense fallback={<div>Loading chat...</div>}>
            <EnhancedChat 
              initialContext={`You are chatting with ${profile.name}, a ${profile.specialization || 'patient'} at our hospital.`}
              onSendMessage={async (message, attachments) => {
                // Implement your chat logic here
                return "Thank you for your message. I'll get back to you soon.";
              }}
            />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}
