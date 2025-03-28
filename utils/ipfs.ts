import { create } from 'ipfs-http-client';

// Type declarations
type IPFSResponse = {
  success: boolean;
  cid?: string;
  url?: string;
  error?: string;
  data?: any;
};

const getIpfsClient = () => {
  const projectId = process.env.NEXT_PUBLIC_INFURA_IPFS_PROJECT_ID;
  const projectSecret = process.env.NEXT_PUBLIC_INFURA_IPFS_PROJECT_SECRET;
  
  if (!projectId || !projectSecret) {
    throw new Error('IPFS credentials not configured');
  }

  const auth = `Basic ${Buffer.from(`${projectId}:${projectSecret}`).toString('base64')}`;

  return create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
      authorization: auth,
    },
  });
};

export const uploadToIPFS = async (data: any): Promise<IPFSResponse> => {
  try {
    const ipfsClient = getIpfsClient();
    
    // Convert data to JSON string if it's not already a string
    const content = typeof data === 'string' ? data : JSON.stringify(data);
    
    // Add the content to IPFS
    const result = await ipfsClient.add(content);
    
    // Return the IPFS hash (CID)
    return {
      success: true,
      cid: result.path,
      url: `https://ipfs.io/ipfs/${result.path}`,
    };
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};

export const getFromIPFS = async (cid: string): Promise<IPFSResponse> => {
  try {
    const ipfsClient = getIpfsClient();
    const chunks: Uint8Array[] = [];
    
    for await (const chunk of ipfsClient.cat(cid)) {
      chunks.push(chunk);
    }
    
    const content = Buffer.concat(chunks).toString();
    
    try {
      // Try to parse as JSON
      return {
        success: true,
        data: JSON.parse(content),
      };
    } catch {
      // If not JSON, return as string
      return {
        success: true,
        data: content,
      };
    }
  } catch (error) {
    console.error('Error getting from IPFS:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};
