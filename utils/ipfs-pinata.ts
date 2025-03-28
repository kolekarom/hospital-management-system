type IPFSResponse = {
  success: boolean;
  cid?: string;
  url?: string;
  error?: string;
  data?: any;
};

export const uploadToIPFS = async (data: any): Promise<IPFSResponse> => {
  try {
    const jwt = process.env.NEXT_PUBLIC_PINATA_JWT;
    
    if (!jwt) {
      throw new Error('Pinata JWT not configured');
    }

    // Convert data to JSON string if it's not already a string
    const content = typeof data === 'string' ? data : JSON.stringify(data);
    
    // Create form data
    const formData = new FormData();
    const blob = new Blob([content], { type: 'application/json' });
    formData.append('file', blob);

    // Upload to Pinata
    const res = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${jwt}`
      },
      body: formData
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.error?.details || 'Failed to upload to Pinata');
    }

    return {
      success: true,
      cid: result.IpfsHash,
      url: `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`,
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
    // Try to fetch from Pinata gateway
    const response = await fetch(`https://gateway.pinata.cloud/ipfs/${cid}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch from IPFS: ${response.statusText}`);
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
  } catch (error) {
    console.error('Error getting from IPFS:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};
