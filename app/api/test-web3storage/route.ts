import { NextRequest, NextResponse } from 'next/server';
import { uploadToWeb3Storage, getFromWeb3Storage } from '@/utils/web3storage';

export async function POST(request: NextRequest) {
  try {
    if (!process.env.NEXT_PUBLIC_WEB3_STORAGE_TOKEN) {
      throw new Error('Web3.Storage token not configured. Please check your .env.local file.');
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      throw new Error('No file provided');
    }

    console.log('Attempting to upload file to Web3.Storage...');

    // Try to upload to Web3.Storage
    const uploadResult = await uploadToWeb3Storage(file);

    if (!uploadResult.success || !uploadResult.cid) {
      throw new Error(uploadResult.error || 'Failed to upload to Web3.Storage');
    }

    // Try to retrieve the data we just uploaded
    const retrieveResult = await getFromWeb3Storage(uploadResult.cid);

    if (!retrieveResult.success) {
      throw new Error(retrieveResult.error || 'Failed to retrieve from Web3.Storage');
    }

    return NextResponse.json({
      success: true,
      message: 'File uploaded to Web3.Storage successfully!',
      upload: uploadResult,
      retrieved: retrieveResult.data
    });

  } catch (error) {
    console.error('Error in Web3.Storage file upload:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'An unknown error occurred' 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    if (!process.env.NEXT_PUBLIC_WEB3_STORAGE_TOKEN) {
      throw new Error('Web3.Storage token not configured. Please check your .env.local file.');
    }

    // Test data
    const testData = {
      test: true,
      timestamp: new Date().toISOString(),
      message: 'If you can see this, your Web3.Storage connection is working!'
    };

    console.log('Attempting to upload test data to Web3.Storage...');

    // Try to upload to Web3.Storage
    const uploadResult = await uploadToWeb3Storage(testData);

    if (!uploadResult.success || !uploadResult.cid) {
      throw new Error(uploadResult.error || 'Failed to upload to Web3.Storage');
    }

    // Try to retrieve the data we just uploaded
    const retrieveResult = await getFromWeb3Storage(uploadResult.cid);

    if (!retrieveResult.success) {
      throw new Error(retrieveResult.error || 'Failed to retrieve from Web3.Storage');
    }

    return NextResponse.json({
      success: true,
      message: 'Web3.Storage test successful!',
      upload: uploadResult,
      retrieved: retrieveResult.data
    });

  } catch (error) {
    console.error('Error in Web3.Storage test:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'An unknown error occurred' 
      },
      { status: 500 }
    );
  }
}
