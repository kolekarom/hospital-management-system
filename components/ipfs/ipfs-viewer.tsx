'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Search, ExternalLink, FileText, Image as ImageIcon } from "lucide-react";
import { getFromIPFS } from "@/utils/ipfs-pinata";

interface IPFSViewerProps {
  initialCID?: string;
  showInput?: boolean;
}

export default function IPFSViewer({ initialCID, showInput = true }: IPFSViewerProps) {
  const [cid, setCid] = useState(initialCID || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [content, setContent] = useState<any>(null);
  const [contentType, setContentType] = useState<'image' | 'json' | 'text' | null>(null);

  const detectContentType = (data: any) => {
    if (typeof data === 'string') {
      if (data.startsWith('data:image') || data.match(/^https?:\/\/.*\.(jpg|jpeg|png|gif|webp)$/i)) {
        return 'image';
      }
      return 'text';
    }
    return 'json';
  };

  const fetchIPFSContent = async () => {
    if (!cid) {
      setError('Please enter an IPFS CID');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await getFromIPFS(cid);
      setContent(data);
      setContentType(detectContentType(data));
    } catch (err) {
      console.error('Error fetching IPFS content:', err);
      setError('Failed to fetch content from IPFS');
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (!content) return null;

    switch (contentType) {
      case 'image':
        return (
          <div className="flex justify-center">
            <img 
              src={content.startsWith('data:') ? content : `https://gateway.pinata.cloud/ipfs/${cid}`} 
              alt="IPFS Content"
              className="max-w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        );
      case 'json':
        return (
          <pre className="bg-gray-50 p-4 rounded-lg overflow-auto max-h-96">
            {JSON.stringify(content, null, 2)}
          </pre>
        );
      case 'text':
        return (
          <div className="prose max-w-none">
            {content}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {contentType === 'image' ? <ImageIcon className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
          IPFS Content Viewer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {showInput && (
          <div className="flex gap-2">
            <Input
              placeholder="Enter IPFS CID"
              value={cid}
              onChange={(e) => setCid(e.target.value)}
            />
            <Button 
              onClick={fetchIPFSContent}
              disabled={loading || !cid}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  View
                </>
              )}
            </Button>
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {content && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>IPFS CID:</span>
              <code className="px-2 py-1 bg-gray-100 rounded">{cid}</code>
              <a
                href={`https://gateway.pinata.cloud/ipfs/${cid}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-600 inline-flex items-center gap-1"
              >
                View on IPFS <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            {renderContent()}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
