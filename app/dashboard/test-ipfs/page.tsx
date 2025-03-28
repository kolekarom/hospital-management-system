'use client';

import { useState } from 'react';

export default function TestIPFS() {
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const testIPFSConnection = async () => {
    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/test-ipfs', {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to test IPFS connection');
      }

      setResult(data);
    } catch (err) {
      console.error('IPFS Test Error:', err);
      let errorMessage = 'An error occurred while testing IPFS connection';
      
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

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Test IPFS Connection</h1>
      
      <div className="space-y-4">
        <button
          onClick={testIPFSConnection}
          disabled={isLoading}
          className={`px-4 py-2 rounded-md text-white ${
            isLoading 
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {isLoading ? 'Testing...' : 'Test IPFS Connection'}
        </button>

        {error && (
          <div className="p-4 rounded-md bg-red-50 border border-red-200 text-red-700">
            <h3 className="font-semibold mb-2">Error</h3>
            <p>{error}</p>
          </div>
        )}

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
