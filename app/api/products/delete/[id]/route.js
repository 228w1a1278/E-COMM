// app/api/products/delete/[id]/route.js
import connectDB from '@/config/db';
import Product from '@/models/Product';
import { NextResponse } from 'next/server';

export async function DELETE(req, context) {
  try {
    await connectDB();

    const id = context.params.id; // ✅ Proper access
    if (!id) {
      return NextResponse.json({ success: false, message: 'ID not provided' }, { status: 400 });
    }

    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
