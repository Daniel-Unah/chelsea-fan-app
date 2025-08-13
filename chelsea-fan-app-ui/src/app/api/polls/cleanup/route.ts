import { NextResponse } from 'next/server';
import { deleteExpiredPolls } from '@/services/polls';

export async function POST() {
  try {
    // Optional: Add authentication/authorization here if needed
        
    await deleteExpiredPolls();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Expired polls cleaned up successfully' 
    });
  } catch (error) {
    console.error('Error in poll cleanup API:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to cleanup expired polls' 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Poll cleanup endpoint. Use POST to trigger cleanup.' 
  });
}
