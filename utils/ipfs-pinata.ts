// Functions for interacting with Pinata IPFS service
const PINATA_API_URL = 'https://api.pinata.cloud';

export const testPinataConnection = async () => {
  try {
    if (!process.env.NEXT_PUBLIC_PINATA_JWT) {
      throw new Error('Pinata JWT token is not configured');
    }

    const response = await fetch(`${PINATA_API_URL}/data/testAuthentication`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Pinata response:', error);
      throw new Error(`Failed to authenticate with Pinata: ${error}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Pinata authentication error:', error);
    throw error;
  }
};

export const pinJSONToIPFS = async (jsonData: any) => {
  try {
    if (!process.env.NEXT_PUBLIC_PINATA_JWT) {
      throw new Error('Pinata JWT token is not configured');
    }

    const response = await fetch(`${PINATA_API_URL}/pinning/pinJSONToIPFS`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`
      },
      body: JSON.stringify(jsonData)
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to pin JSON to IPFS: ${error}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error pinning to IPFS:', error);
    throw error;
  }
};

export const pinFileToIPFS = async (file: File) => {
  try {
    if (!process.env.NEXT_PUBLIC_PINATA_JWT) {
      throw new Error('Pinata JWT token is not configured');
    }

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${PINATA_API_URL}/pinning/pinFileToIPFS`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`
      },
      body: formData
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to pin file to IPFS: ${error}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error pinning file to IPFS:', error);
    throw error;
  }
};

export const getFromIPFS = async (ipfsHash: string) => {
  try {
    const response = await fetch(`https://gateway.pinata.cloud/ipfs/${ipfsHash}`);
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to fetch from IPFS: ${error}`);
    }

    const text = await response.text();
    try {
      // Try to parse as JSON first
      return JSON.parse(text);
    } catch {
      // If not JSON, return as text
      return text;
    }
  } catch (error) {
    console.error('Error fetching from IPFS:', error);
    throw error;
  }
};
