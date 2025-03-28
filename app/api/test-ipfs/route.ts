import { NextRequest, NextResponse } from "next/server";
import { testPinataConnection, pinJSONToIPFS, pinFileToIPFS } from "@/utils/ipfs-pinata";

export async function GET() {
  try {
    // First test the connection
    const authResult = await testPinataConnection();
    console.log("Pinata authentication successful:", authResult);

    // Then try to pin some test data
    const testObject = {
      test: "This is a test object",
      timestamp: new Date().toISOString(),
    };

    const pinResult = await pinJSONToIPFS(testObject);

    return NextResponse.json({
      success: true,
      ipfsHash: pinResult.IpfsHash,
      message: "Successfully connected to Pinata and pinned data to IPFS.",
      authResult,
      pinResult,
    });
  } catch (error) {
    console.error("Pinata/IPFS error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to connect to Pinata or pin data to IPFS.",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      throw new Error('No file provided');
    }

    console.log('Attempting to upload file to IPFS via Pinata...');
    const result = await pinFileToIPFS(file);

    return NextResponse.json({
      success: true,
      message: 'File uploaded to IPFS successfully!',
      upload: {
        cid: result.IpfsHash,
        url: `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`,
      }
    });

  } catch (error) {
    console.error('Error in IPFS file upload:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'An unknown error occurred' 
      },
      { status: 500 }
    );
  }
}
