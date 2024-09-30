"use client";

import React, { useState } from 'react';
import styles from './page.module.css'; // นำเข้า CSS Module

const ExpenseTracker: React.FC = () => {
    const [amount, setAmount] = useState<number | ''>('');
    const [date, setDate] = useState<string>('');
    const [type, setType] = useState<string>('รายรับ');
    const [note, setNote] = useState<string>('');
    const [records, setRecords] = useState<Array<{ amount: number; date: string; type: string; note: string }>>([]);

    const handleSubmit = async (event: React.FormEvent) => {
      event.preventDefault();
  
      if (amount && date) {
          const newRecord = { amount: Number(amount), date, type, note };
  
          try {
              const response = await fetch('/api/v1/todo', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(newRecord),
              });
  
              if (!response.ok) {
                  throw new Error('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
              }
  
              const data = await response.json();
              console.log(data.message); // แสดงข้อความที่ได้จาก API
  
              setRecords((prevRecords) => [...prevRecords, newRecord]);
              resetForm();
          } catch (error) {
              console.error(error);
          }
      }
  };


    const resetForm = () => {
        setAmount('');
        setDate('');
        setType('รายรับ');
        setNote('');
    };

    // ฟังก์ชันคำนวณยอดรวมรายรับ
    const getTotalIncome = () => {
        return records
            .filter((record) => record.type === 'รายรับ')
            .reduce((total, record) => total + record.amount, 0);
    };

    // ฟังก์ชันคำนวณยอดรวมรายจ่าย
    const getTotalExpense = () => {
        return records
            .filter((record) => record.type === 'รายจ่าย')
            .reduce((total, record) => total + record.amount, 0);
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>บันทึกรายรับรายจ่าย</h1>
            <form className={styles.form} onSubmit={handleSubmit}>
                <FormField
                    label="จำนวน:"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    required
                />
                <FormField
                    label="วันที่:"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                />
                <label className={styles.label}>
                    ประเภท:
                    <select className={styles.select} value={type} onChange={(e) => setType(e.target.value)} required>
                        <option value="รายรับ">รายรับ</option>
                        <option value="รายจ่าย">รายจ่าย</option>
                    </select>
                </label>
                <label className={styles.label}>
                    โน้ต:
                    <textarea
                        className={styles.textarea}
                        value={note}    
                        onChange={(e) => setNote(e.target.value)}
                        rows={4}
                    />   
                </label>
                <button className={styles.button} type="submit">บันทึก</button>
            </form>

            <div className={styles.summary}>
                <h2>สรุป</h2>
                <p>ยอดรวมรายรับ: {getTotalIncome()} บาท</p>
                <p>ยอดรวมรายจ่าย: {getTotalExpense()} บาท</p>
                <p>ยอดสุทธิ: {getTotalIncome() - getTotalExpense()} บาท</p>
            </div>

            <div className={styles.records}>
                <h2>บันทึก</h2>
                {records.map((record, index) => (
                    <p key={index} className={styles.record}>
                        วันที่: {record.date}, จำนวน: {record.amount}, ประเภท: {record.type}, โน้ต: {record.note}
                    </p>
                ))}
            </div>
        </div>
    );
};

// คอมโพเนนต์ย่อยสำหรับฟอร์มฟิลด์
const FormField: React.FC<{
    label: string;
    type: string;
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    required?: boolean;
}> = ({ label, type, value, onChange, required }) => (
    <label className={styles.label}>
        {label}
        <input
            className={styles.input}
            type={type}
            value={value}
            onChange={onChange}
            required={required}
        />
    </label>
);

export default ExpenseTracker;