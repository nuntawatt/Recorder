"use client";
import React, { useState, useEffect } from "react";
import "../../src/app/style.css";

interface Transaction {
  _id: string;
  amount: number;
  date: string;
  type: "income" | "expense";
  note: string;
}

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [amount, setAmount] = useState<number>(0);
  const [date, setDate] = useState<string>("");
  const [type, setType] = useState<"income" | "expense">("income");
  const [note, setNote] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>(""); // State for error handling

  // ดึงข้อมูล Transaction ทั้งหมดเมื่อโหลดหน้า
  useEffect(() => {
    fetch("http://localhost:3000/api/v1/todo", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        setTransactions(data.data); // ใช้ data.data ตามที่ API ส่งกลับ
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch transactions."); // Set error message
      })
      .finally(() => setLoading(false)); // Set loading to false regardless of success or error
  }, []);

  // สร้าง Transaction ใหม่
  const handleCreateTransaction = () => {
    if (!amount || !date || !note) {
      alert("Please fill in all fields.");
      return;
    }

    fetch("http://localhost:3000/api/v1/todo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount, date, type, note }), // ส่งข้อมูลที่จำเป็น
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        setTransactions([...transactions, data.data]); // เพิ่ม transaction ใหม่เข้าไปในรายการ
        setAmount(0);
        setDate("");
        setNote("");
      })
      .catch((error) => {
        console.error(error);
        alert("Failed to create transaction."); // Alert on error
      });
  };

  // ลบ Transaction พร้อมแสดงแจ้งเตือน
  const handleDelete = (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this transaction?");
    if (confirmed) {
      fetch(`http://localhost:3000/api/v1/todo/${id}`, { // เปลี่ยน URL เพื่อให้ถูกต้อง
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ _id: id }), // ใช้ _id ในการลบ
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Network response was not ok");
          }
          return res.json();
        })
        .then(() => {
          setTransactions(transactions.filter((transaction) => transaction._id !== id)); // ลบรายการที่ถูกลบออกจาก state
        })
        .catch((error) => {
          console.error(error);
          alert("Failed to delete transaction."); // Alert on error
        });
    }
  };

  return (
    <div className="page">
      <h1>บันทึกข้อมูลรายรับ-รายจ่าย</h1>

      <div>
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="input-field"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="input-field"
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value as "income" | "expense")}
          className="input-field"
        >
          <option value="income">รายรับ</option>
          <option value="expense">รายจ่าย</option>
        </select>
        <input
          type="text"
          placeholder="Note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="input-field"
        />
        <button onClick={handleCreateTransaction} className="btn create-btn">
          เพิ่มรายการ
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p> // Display error message if there's an error
      ) : (
        <ul className="transaction-list">
          {transactions.map((transaction) => (
            <li key={transaction._id} className="transaction-item">
              <h3>จำนวน: {transaction.amount} บาท</h3>
              <p>วันที่: {transaction.date}</p>
              <p>ประเภท: {transaction.type === "income" ? "รายรับ" : "รายจ่าย"}</p>
              <p>โน้ต: {transaction.note}</p>
              <button onClick={() => handleDelete(transaction._id)} className="btn delete-btn">
                ลบ
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
