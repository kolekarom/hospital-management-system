'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, Filter } from "lucide-react";
import IPFSViewer from '@/components/ipfs/ipfs-viewer';
import { prisma } from '@/lib/prisma';

interface IPFSDataItem {
  id: string;
  cid: string;
  name: string;
  type: string;
  size: number;
  metadata: any;
  createdAt: string;
}

export default function IPFSExplorer() {
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<string>('all');
  const [ipfsData, setIpfsData] = useState<IPFSDataItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<IPFSDataItem | null>(null);

  useEffect(() => {
    fetchIPFSData();
  }, []);

  const fetchIPFSData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/ipfs/list');
      const data = await response.json();
      setIpfsData(data.items);
    } catch (error) {
      console.error('Error fetching IPFS data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = ipfsData.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.cid.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || item.type === filter;
    return matchesSearch && matchesFilter;
  });

  const formatSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>IPFS Data Explorer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search by name or CID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border rounded-md px-3 py-2"
            >
              <option value="all">All Types</option>
              <option value="image">Images</option>
              <option value="document">Documents</option>
              <option value="json">JSON</option>
            </select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((item) => (
                    <TableRow
                      key={item.id}
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => setSelectedItem(item)}
                    >
                      <TableCell>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-gray-500">{item.cid}</div>
                      </TableCell>
                      <TableCell>
                        <Badge>{item.type}</Badge>
                      </TableCell>
                      <TableCell>{formatSize(item.size)}</TableCell>
                      <TableCell>{formatDate(item.createdAt)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div>
              {selectedItem ? (
                <Card>
                  <CardHeader>
                    <CardTitle>{selectedItem.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <IPFSViewer initialCID={selectedItem.cid} showInput={false} />
                    
                    <div className="mt-4 space-y-2">
                      <h3 className="font-semibold">Metadata</h3>
                      <pre className="bg-gray-50 p-4 rounded-lg overflow-auto max-h-48">
                        {JSON.stringify(selectedItem.metadata, null, 2)}
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  Select an item to view its contents
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
