'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, XCircle, RefreshCw } from "lucide-react";
import { testPinataConnection } from "@/utils/ipfs-pinata";

export default function TestIpfs() {
  const [ipfsResult, setIpfsResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const testIpfsConnection = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await testPinataConnection();
      setIpfsResult(response);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch IPFS test result:", error);
      setError("Failed to fetch IPFS test result: " + (error instanceof Error ? error.message : String(error)));
      setLoading(false);
    }
  };

  useEffect(() => {
    testIpfsConnection();
  }, []);

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            IPFS Connection Test
            <Button
              variant="outline"
              size="sm"
              onClick={testIpfsConnection}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              {loading ? "Testing..." : "Test Again"}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center p-6">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : ipfsResult ? (
            <div className="space-y-4">
              <Alert variant="default" className="bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800">Success!</AlertTitle>
                <AlertDescription className="text-green-700">
                  Successfully connected to Pinata and authenticated.
                </AlertDescription>
              </Alert>

              <div className="mt-4">
                <h3 className="text-lg font-medium">Response Details:</h3>
                <pre className="p-2 mt-1 bg-gray-100 rounded text-sm overflow-x-auto">
                  {JSON.stringify(ipfsResult, null, 2)}
                </pre>
              </div>
            </div>
          ) : (
            <div>No result data available.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
