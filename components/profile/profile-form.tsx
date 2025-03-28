import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Upload } from "lucide-react";
import { pinFileToIPFS, pinJSONToIPFS } from "@/utils/ipfs-pinata";

interface ProfileData {
  name: string;
  specialization?: string;
  qualification: string;
  experience: string;
  email: string;
  phone: string;
  bio: string;
  profileImage?: {
    cid: string;
    url: string;
  };
  documents?: Array<{
    name: string;
    cid: string;
    url: string;
    type: string;
  }>;
  licenseNumber?: string;
  address: string;
  department?: string;
  availability: Availability[];
}

interface Availability {
  day: string;
  slots: TimeSlot[];
}

interface TimeSlot {
  start: string;
  end: string;
  isBooked: boolean;
}

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const DEFAULT_SLOTS = [
  { start: '09:00', end: '10:00', isBooked: false },
  { start: '10:00', end: '11:00', isBooked: false },
  { start: '11:00', end: '12:00', isBooked: false },
  { start: '14:00', end: '15:00', isBooked: false },
  { start: '15:00', end: '16:00', isBooked: false },
  { start: '16:00', end: '17:00', isBooked: false },
];

export default function ProfileForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);
  
  const [profile, setProfile] = useState<ProfileData>({
    name: '',
    specialization: '',
    qualification: '',
    experience: '',
    email: '',
    phone: '',
    bio: '',
    licenseNumber: '',
    address: '',
    department: '',
    availability: DAYS_OF_WEEK.map(day => ({
      day,
      slots: [...DEFAULT_SLOTS]
    }))
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingDocument, setUploadingDocument] = useState(false);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      setError(null);

      const result = await pinFileToIPFS(file);
      
      setProfile(prev => ({
        ...prev,
        profileImage: {
          cid: result.IpfsHash,
          url: `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`
        }
      }));
    } catch (err) {
      console.error('Error uploading image:', err);
      setError('Failed to upload profile image. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDocumentUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploadingDocument(true);
      setError(null);

      const result = await pinFileToIPFS(file);
      
      setProfile(prev => ({
        ...prev,
        documents: [
          ...(prev.documents || []),
          {
            name: file.name,
            cid: result.IpfsHash,
            url: `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`,
            type: file.type
          }
        ]
      }));
    } catch (err) {
      console.error('Error uploading document:', err);
      setError('Failed to upload document. Please try again.');
    } finally {
      setUploadingDocument(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Pin the entire profile data to IPFS
      const ipfsResult = await pinJSONToIPFS(profile);
      
      // Here you would typically save the profile data and IPFS hash to your database
      // await saveProfileToDatabase({ ...profile, ipfsHash: ipfsResult.IpfsHash });

      router.push('/dashboard'); // Or wherever you want to redirect after success
    } catch (err) {
      console.error('Error saving profile:', err);
      setError('Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardContent className="p-6 space-y-4">
          {/* Profile Image Upload */}
          <div className="space-y-2">
            <Label>Profile Image</Label>
            <div className="flex items-center gap-4">
              {profile.profileImage && (
                <img 
                  src={profile.profileImage.url} 
                  alt="Profile" 
                  className="w-24 h-24 rounded-full object-cover"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                ref={fileInputRef}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingImage}
              >
                {uploadingImage ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Image
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Document Upload */}
          <div className="space-y-2">
            <Label>Documents</Label>
            <div className="space-y-4">
              {profile.documents?.map((doc, index) => (
                <div key={index} className="flex items-center gap-2 p-2 border rounded">
                  <a 
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline flex-1"
                  >
                    {doc.name}
                  </a>
                </div>
              ))}
              <input
                type="file"
                onChange={handleDocumentUpload}
                ref={documentInputRef}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => documentInputRef.current?.click()}
                disabled={uploadingDocument}
              >
                {uploadingDocument ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading Document...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Document
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={e => setProfile(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={e => setProfile(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={profile.phone}
                onChange={e => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={profile.address}
                onChange={e => setProfile(prev => ({ ...prev, address: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={profile.bio}
                onChange={e => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                required
              />
            </div>

            {/* Professional Information */}
            <div>
              <Label htmlFor="qualification">Qualification</Label>
              <Input
                id="qualification"
                value={profile.qualification}
                onChange={e => setProfile(prev => ({ ...prev, qualification: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="experience">Experience (years)</Label>
              <Input
                id="experience"
                value={profile.experience}
                onChange={e => setProfile(prev => ({ ...prev, experience: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="specialization">Specialization</Label>
              <Input
                id="specialization"
                value={profile.specialization}
                onChange={e => setProfile(prev => ({ ...prev, specialization: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                value={profile.department}
                onChange={e => setProfile(prev => ({ ...prev, department: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="licenseNumber">License Number</Label>
              <Input
                id="licenseNumber"
                value={profile.licenseNumber}
                onChange={e => setProfile(prev => ({ ...prev, licenseNumber: e.target.value }))}
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Profile'
            )}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}
