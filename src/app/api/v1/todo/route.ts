import { connectToDatabase } from "@/lib/mongodb";
import Todo from "@/models/todo";
import { NextRequest, NextResponse } from "next/server";

// CRUD => CREATE UPDATE 
// READ data
// url => api/v1/todo
export async function GET() {
  try {
    await connectToDatabase();
    const todoResult = await Todo.find({});
    return NextResponse.json({ data: todoResult });
  } catch (err) {
    return NextResponse.json({
      error: err,
    });
  }
}
// Create
// req => {name: "", note: ""}
// url => api/v1/todo/id
export async function POST(req: NextRequest){
  try {
  const body = await req.json();
  const res = await Todo.create(body);
  return NextResponse.json({data: res});
  }catch(error){
    return NextResponse.json({
      error: error,
    });
  }
}
// Update
export async function PUT(req: NextRequest){
  try {
    const body = await req.json();
    const res = await Todo.updateOne(body);
    return NextResponse.json({data: res});
    }catch(error){
      return NextResponse.json({
        error: error,
      });
    }
}
// Delete
export async function DELETE(req: NextRequest){
  try {
    const body = await req.json();
    const res = await Todo.deleteOne(body);
    return NextResponse.json({data: res});
    }catch(error){
      return NextResponse.json({
        error: error,
      });
    }
}