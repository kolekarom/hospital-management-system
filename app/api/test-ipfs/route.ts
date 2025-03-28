import { NextResponse } from 'next/server';
import { uploadToIPFS, getFromIPFS } from '@/utils/ipfs-pinata';

export async function GET() {
  try {
    if (!process.env.NEXT_PUBLIC_PINATA_JWT) {
      throw new Error('Pinata JWT not configured. Please check your .env.local file.');
    }

    // Test data
    const testData = {
      test: true,
      timestamp: new Date().toISOString(),
      message: 'If you can see this, your IPFS connection is working!'
    };

    console.log('Attempting to upload test data to IPFS...');

    // Try to upload to IPFS
    const uploadResult = await uploadToIPFS(testData);

    if (!uploadResult.success || !uploadResult.cid) {
      throw new Error(uploadResult.error || 'Failed to upload to IPFS');
    }

    // Try to retrieve the data we just uploaded
    const retrieveResult = await getFromIPFS(uploadResult.cid);

    if (!retrieveResult.success) {
      throw new Error(retrieveResult.error || 'Failed to retrieve from IPFS');
    }

    return NextResponse.json({
      success: true,
      message: 'IPFS test successful!',
      upload: uploadResult,
      retrieved: retrieveResult.data
    });

  } catch (error) {
    console.error('Error in IPFS test:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'An unknown error occurred' 
      },
      { status: 500 }
    );
  }
}
