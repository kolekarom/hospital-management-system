'use client';

import { useState, useRef } from 'react';

export default function TestWeb3Storage() {
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const testConnection = async () => {
    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/test-web3storage', {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to test Web3.Storage connection');
      }

      setResult(data);
    } catch (err) {
      console.error('Web3.Storage Test Error:', err);
      let errorMessage = 'An error occurred while testing Web3.Storage connection';
      
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      } else if (err && typeof err === 'object' && 'message' in err) {
        errorMessage = String(err.message);
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError('');
      setResult(null);
    }
  };

  const uploadFile = async () => {
    if (!selectedFile) {
      setError('Please select a file first');
      return;
    }

    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch('/api/test-web3storage', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload file to Web3.Storage');
      }

      setResult(data);
    } catch (err) {
      console.error('File Upload Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload file');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Test Web3.Storage Connection</h1>
      
      <div className="space-y-6">
        {/* Test Connection Button */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Test Basic Connection</h2>
          <button
            onClick={testConnection}
            disabled={isLoading}
            className={`px-4 py-2 rounded-md text-white ${
              isLoading 
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {isLoading ? 'Testing...' : 'Test Web3.Storage Connection'}
          </button>
        </div>

        {/* File Upload Section */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Upload File to Web3.Storage</h2>
          <div className="space-y-3">
            <input
              type="file"
              onChange={handleFileChange}
              ref={fileInputRef}
              className="hidden"
              disabled={isLoading}
            />
            <div className="flex gap-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50"
              >
                Select File
              </button>
              <button
                onClick={uploadFile}
                disabled={isLoading || !selectedFile}
                className={`px-4 py-2 rounded-md text-white ${
                  isLoading || !selectedFile
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-500 hover:bg-green-600'
                }`}
              >
                {isLoading ? 'Uploading...' : 'Upload to Web3.Storage'}
              </button>
            </div>
            {selectedFile && (
              <p className="text-sm text-gray-600">
                Selected: {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
              </p>
            )}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-4 rounded-md bg-red-50 border border-red-200 text-red-700">
            <h3 className="font-semibold mb-2">Error</h3>
            <p>{error}</p>
          </div>
        )}

        {/* Result Display */}
        {result && (
          <div className="p-4 rounded-md bg-green-50 border border-green-200">
            <h3 className="font-semibold mb-2 text-green-700">Success!</h3>
            <div className="space-y-4">
              <div>
                <p className="text-green-700">{result.message}</p>
              </div>

              {result.upload && (
                <div className="mt-2">
                  <h4 className="font-medium text-gray-700">Upload Result:</h4>
                  <div className="bg-white p-3 rounded-md mt-1 border border-gray-200">
                    <p className="text-sm text-gray-600">IPFS CID:</p>
                    <code className="block p-2 bg-gray-100 rounded mt-1">
                      {result.upload.cid}
                    </code>
                    <p className="text-sm text-gray-600 mt-2">IPFS URL:</p>
                    <a
                      href={result.upload.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline break-all"
                    >
                      {result.upload.url}
                    </a>
                  </div>
                </div>
              )}

              {result.retrieved && (
                <div className="mt-2">
                  <h4 className="font-medium text-gray-700">Retrieved Data:</h4>
                  <pre className="bg-gray-100 p-3 rounded-md mt-1 overflow-auto">
                    {JSON.stringify(result.retrieved, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
