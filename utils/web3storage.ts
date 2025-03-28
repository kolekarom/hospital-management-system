type Web3StorageResponse = {
  success: boolean;
  cid?: string;
  url?: string;
  error?: string;
  data?: any;
};

export const uploadToWeb3Storage = async (data: any): Promise<Web3StorageResponse> => {
  try {
    const token = process.env.NEXT_PUBLIC_WEB3_STORAGE_TOKEN;
    
    if (!token) {
      throw new Error('Web3.Storage token not configured');
    }

    // Convert data to File object if it's not already
    let file: File;
    if (data instanceof File) {
      file = data;
    } else if (data instanceof Buffer) {
      file = new File([data], 'data.bin', { type: 'application/octet-stream' });
    } else {
      const content = typeof data === 'string' ? data : JSON.stringify(data);
      file = new File([content], 'data.json', { type: 'application/json' });
    }

    // Create form data
    const formData = new FormData();
    formData.append('file', file);

    // Upload to Web3.Storage
    const response = await fetch('https://api.web3.storage/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to upload to Web3.Storage: ${error}`);
    }

    const result = await response.json();
    const cid = result.cid;

    return {
      success: true,
      cid,
      url: `https://${cid}.ipfs.dweb.link`,
    };
  } catch (error) {
    console.error('Error uploading to Web3.Storage:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};

export const getFromWeb3Storage = async (cid: string): Promise<Web3StorageResponse> => {
  try {
    // Try to fetch from Web3.Storage gateway
    const response = await fetch(`https://${cid}.ipfs.dweb.link`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch from Web3.Storage: ${response.statusText}`);
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
    console.error('Error getting from Web3.Storage:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};
