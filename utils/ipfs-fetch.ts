// IPFS Gateway URLs
const IPFS_GATEWAYS = [
  'https://ipfs.io/ipfs/',
  'https://gateway.pinata.cloud/ipfs/',
  'https://cloudflare-ipfs.com/ipfs/',
  'https://gateway.ipfs.io/ipfs/'
];

type IPFSResponse = {
  success: boolean;
  cid?: string;
  url?: string;
  error?: string;
  data?: any;
};

export const uploadToIPFS = async (data: any): Promise<IPFSResponse> => {
  try {
    const projectId = process.env.NEXT_PUBLIC_INFURA_IPFS_PROJECT_ID;
    const projectSecret = process.env.NEXT_PUBLIC_INFURA_IPFS_PROJECT_SECRET;
    
    if (!projectId || !projectSecret) {
      throw new Error('IPFS credentials not configured');
    }

    const auth = `Basic ${Buffer.from(`${projectId}:${projectSecret}`).toString('base64')}`;
    
    // Convert data to JSON string if it's not already a string
    const content = typeof data === 'string' ? data : JSON.stringify(data);
    
    // Create form data
    const formData = new FormData();
    formData.append('file', new Blob([content], { type: 'application/json' }));

    // Upload to Infura IPFS API
    const response = await fetch('https://ipfs.infura.io:5001/api/v0/add', {
      method: 'POST',
      headers: {
        'Authorization': auth,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    return {
      success: true,
      cid: result.Hash,
      url: `${IPFS_GATEWAYS[0]}${result.Hash}`,
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
    // Try each gateway until one works
    for (const gateway of IPFS_GATEWAYS) {
      try {
        const response = await fetch(`${gateway}${cid}`);
        
        if (!response.ok) {
          continue; // Try next gateway if this one fails
        }

        const content = await response.text();
        
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
      } catch {
        continue; // Try next gateway if this one fails
      }
    }

    throw new Error('Failed to retrieve from all IPFS gateways');
  } catch (error) {
    console.error('Error getting from IPFS:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};
