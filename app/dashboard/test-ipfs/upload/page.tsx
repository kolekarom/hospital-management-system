'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, XCircle, Upload, File } from "lucide-react";

export default function UploadToIPFS() {
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
      setResult(null);
    }
  };

  const uploadToIPFS = async () => {
    if (!selectedFile) {
      setError('Please select a file first');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch('/api/test-ipfs', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload to IPFS');
      }

      setResult(data);
    } catch (err) {
      console.error('Upload Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload file');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload to IPFS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* File Selection */}
            <div className="space-y-4">
              <input
                type="file"
                onChange={handleFileChange}
                ref={fileInputRef}
                className="hidden"
              />
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-gray-400 transition-colors">
                <File className="h-8 w-8 text-gray-400 mb-2" />
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={loading}
                >
                  Select File
                </Button>
                {selectedFile && (
                  <p className="mt-2 text-sm text-gray-600">
                    Selected: {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
                  </p>
                )}
              </div>
              <Button
                className="w-full"
                onClick={uploadToIPFS}
                disabled={!selectedFile || loading}
              >
                {loading ? 'Uploading...' : 'Upload to IPFS'}
              </Button>
            </div>

            {/* Error Display */}
            {error && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Success Display */}
            {result && (
              <div className="space-y-4">
                <Alert variant="default" className="bg-green-50 border-green-200">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertTitle className="text-green-800">Upload Successful!</AlertTitle>
                  <AlertDescription className="text-green-700">
                    Your file has been successfully uploaded to IPFS.
                  </AlertDescription>
                </Alert>

                <div className="mt-4">
                  <h3 className="text-lg font-medium">IPFS Hash:</h3>
                  <code className="block p-2 mt-1 bg-gray-100 rounded text-sm overflow-x-auto">
                    {result.upload?.cid}
                  </code>
                  <p className="mt-2 text-sm text-gray-500">
                    View your file at:{" "}
                    <a
                      href={result.upload?.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {result.upload?.url}
                    </a>
                  </p>
                </div>

                <div className="mt-4">
                  <h3 className="text-lg font-medium">Response Details:</h3>
                  <pre className="p-2 mt-1 bg-gray-100 rounded text-sm overflow-x-auto">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
