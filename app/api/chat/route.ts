import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { OpenAI } from 'openai';
import { pinJSONToIPFS } from '@/utils/ipfs-pinata';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { content, senderId, receiverId, attachments } = await req.json();

    // AI analysis of the message
    const aiAnalysis = await analyzeMessage(content);

    // Store message in database
    const message = await prisma.message.create({
      data: {
        content,
        senderId,
        receiverId,
        attachments: attachments || [],
        metadata: {
          aiAnalysis,
          isProcessed: true
        }
      },
      include: {
        sender: true,
        receiver: true
      }
    });

    // Generate AI response if receiver is a doctor
    const receiver = await prisma.user.findUnique({
      where: { id: receiverId }
    });

    let aiResponse = null;
    if (receiver?.role === 'doctor') {
      aiResponse = await generateAIResponse(content, receiver);
      
      // Store AI response
      await prisma.message.create({
        data: {
          content: aiResponse,
          senderId: receiverId,
          receiverId: senderId,
          metadata: {
            isAIGenerated: true
          }
        }
      });
    }

    return NextResponse.json({
      message,
      aiResponse
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId },
          { receiverId: userId }
        ]
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            role: true
          }
        },
        receiver: {
          select: {
            id: true,
            name: true,
            role: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 50
    });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

async function analyzeMessage(content: string) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a medical assistant analyzing patient messages. Extract key symptoms, concerns, and urgency level."
        },
        {
          role: "user",
          content
        }
      ]
    });

    return {
      analysis: response.choices[0].message.content,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('AI analysis error:', error);
    return null;
  }
}

async function generateAIResponse(content: string, doctor: any) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are Dr. ${doctor.name}, a ${doctor.role} at the hospital. Provide a professional and helpful response to the patient's message.`
        },
        {
          role: "user",
          content
        }
      ]
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('AI response error:', error);
    return "I apologize, but I'm currently unavailable. Please try again later or contact another doctor.";
  }
}
