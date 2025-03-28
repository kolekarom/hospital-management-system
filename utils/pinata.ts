import axios, { AxiosError } from 'axios';

// Only use NEXT_PUBLIC_ variables on the client side
const PINATA_JWT = process.env.NEXT_PUBLIC_PINATA_JWT;

interface PinataResponse {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
}

interface PinataErrorResponse {
  error?: {
    reason: string;
    details: string;
  };
  message?: string;
}

interface IPFSResponse {
  success: boolean;
  pinataUrl?: string;
  message?: string;
  data?: any;
}

function getAuthHeaders() {
  if (!PINATA_JWT) {
    return null;
  }
  return {
    'Authorization': `Bearer ${PINATA_JWT}`,
    'Content-Type': 'application/json'
  };
}

// Function to upload JSON data to IPFS
export async function uploadJSONToIPFS(JSONBody: any): Promise<IPFSResponse> {
  const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
  
  try {
    const headers = getAuthHeaders();
    if (!headers) {
      throw new Error('Pinata JWT not configured. Please set NEXT_PUBLIC_PINATA_JWT in your environment variables.');
    }

    const response = await axios.post<PinataResponse>(url, JSONBody, { headers });

    return {
      success: true,
      pinataUrl: "ipfs://" + response.data.IpfsHash
    };
  } catch (error) {
    const err = error as AxiosError<PinataErrorResponse>;
    let errorMessage: string;

    if (err.response?.status === 401) {
      errorMessage = 'Invalid Pinata JWT token. Please check your credentials.';
    } else if (!err.response) {
      errorMessage = 'Network error. Please check your internet connection.';
    } else {
      errorMessage = err.response?.data?.error?.details || 
                    err.response?.data?.message || 
                    err.message || 
                    'Unknown error occurred';
    }

    console.error('Error uploading to IPFS:', errorMessage);
    return {
      success: false,
      message: errorMessage
    };
  }
}

// Function to upload file to IPFS
export async function uploadFileToIPFS(file: File): Promise<IPFSResponse> {
  try {
    const headers = getAuthHeaders();
    if (!headers) {
      throw new Error('Pinata JWT not configured. Please set NEXT_PUBLIC_PINATA_JWT in your environment variables.');
    }

    const formData = new FormData();
    formData.append('file', file);

    // Add pinataOptions to the formData
    const pinataOptions = JSON.stringify({
      cidVersion: 1,
      wrapWithDirectory: false
    });
    formData.append('pinataOptions', pinataOptions);

    // Override Content-Type for file upload
    headers['Content-Type'] = 'multipart/form-data';

    const response = await axios.post<PinataResponse>(
      'https://api.pinata.cloud/pinning/pinFileToIPFS',
      formData,
      { 
        headers,
        maxBodyLength: Infinity
      }
    );

    return {
      success: true,
      pinataUrl: "ipfs://" + response.data.IpfsHash
    };
  } catch (error) {
    const err = error as AxiosError<PinataErrorResponse>;
    let errorMessage: string;

    if (err.response?.status === 401) {
      errorMessage = 'Invalid Pinata JWT token. Please check your credentials.';
    } else if (err.response?.status === 413) {
      errorMessage = 'File size too large for Pinata. Maximum file size is 100MB.';
    } else if (!err.response) {
      errorMessage = 'Network error. Please check your internet connection.';
    } else {
      errorMessage = err.response?.data?.error?.details || 
                    err.response?.data?.message || 
                    err.message || 
                    'Unknown error occurred while uploading to IPFS';
    }

    console.error('Error uploading file to IPFS:', errorMessage);
    return {
      success: false,
      message: errorMessage
    };
  }
}

// Function to get data from IPFS
export async function getFromIPFS(pinataUrl: string): Promise<IPFSResponse> {
  try {
    const hash = pinataUrl.replace('ipfs://', '');
    const url = `https://gateway.pinata.cloud/ipfs/${hash}`;
    
    const response = await axios.get(url);
    
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    const err = error as AxiosError<PinataErrorResponse>;
    const errorMessage = typeof err.response?.data === 'string' 
      ? err.response.data 
      : err.response?.data?.error?.details || 
        err.response?.data?.message || 
        err.message || 
        'Failed to fetch from IPFS';
    
    console.error('Error fetching from IPFS:', errorMessage);
    return {
      success: false,
      message: errorMessage
    };
  }
}
