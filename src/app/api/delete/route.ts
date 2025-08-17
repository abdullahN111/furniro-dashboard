import { serverClient } from '@/sanity/lib/serverClient';
import { NextResponse } from 'next/server';

export async function DELETE(req: Request) {
  try {
    console.log("Sanity Token Used:", process.env.SANITY_DELETE_TOKEN);

    const body = await req.json(); 
    const { id } = body;


    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Missing product ID' },
        { status: 400 }
      );
    }

    await serverClient.delete(id); 
    return NextResponse.json(
      { success: true, message: 'Product deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
