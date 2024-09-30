// src/app/api/todo/route.ts
import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = 'mongodb+srv://moragon:abYRP75FhqkjOAFS@cluster0.rxw2a.mongodb.net/'; 
const client = new MongoClient(uri);

export async function POST(request: Request) {
    const body = await request.json();
    
    const { amount, date, type, note } = body;

    try {
        await client.connect();
        const database = client.db('Todo-app'); // แทนที่ด้วยชื่อฐานข้อมูลของคุณ
        const collection = database.collection('todos'); // แทนที่ด้วยชื่อคอลเลคชันของคุณ

        const newExpense = { amount, date, type, note };
        await collection.insertOne(newExpense);

        return NextResponse.json({ message: 'บันทึกสำเร็จ' }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'เกิดข้อผิดพลาดในการบันทึก' }, { status: 500 });
    } finally {
        await client.close();
    }
}