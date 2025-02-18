"use client";

import {useMemo } from "react";
import Link from "next/link";
import Image from "next/image";

const Transactions = () => {
  const transactions = useMemo(
    () => [
      {
        id: "#T001",
        name: "John Doe",
        status: "Pending",
        date: "12.02.2025",
        amount: "$320.00",
        statusColor: "bg-[#f7cb7375]",
      },
      {
        id: "#T002",
        name: "Alice Green",
        status: "Done",
        date: "11.02.2025",
        amount: "$210.00",
        statusColor: "bg-[#afd6ee75]",
      },
      {
        id: "#T003",
        name: "Michael Brown",
        status: "Cancelled",
        date: "10.02.2025",
        amount: "$500.00",
        statusColor: "bg-[#f7737375]",
      },
      {
        id: "#T004",
        name: "Emma Smith",
        status: "Pending",
        date: "09.02.2025",
        amount: "$150.00",
        statusColor: "bg-[#f7cb7375]",
      },
      {
        id: "#T005",
        name: "Sophia White",
        status: "Done",
        date: "08.02.2025",
        amount: "$750.00",
        statusColor: "bg-[#afd6ee75]",
      },
    ],
    []
  );

  return (
    <div className="container bg-[--bgSoft] w-full p-4 rounded-[10px] mt-5">
      <h2 className="mb-[20px] font-light text-[--textSoft] text-lg sm:text-xl">
        Latest Transactions
      </h2>

      <div className="hidden md:block overflow-x-auto">
        <table className="w-full table-fixed">
          <thead>
            <tr className="bg-[#2e374a] text-white">
              <th className="p-[10px] text-left w-1/4">Name</th>
              <th className="p-[10px] text-left w-1/4">Status</th>
              <th className="p-[10px] text-left w-1/4">Date</th>
              <th className="p-[10px] text-left w-1/4">Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="bg-[--bgSoft] text-white">
                <td className="p-[10px] text-left">
                  <div className="flex items-center gap-[12px]">
                    <Image
                      src="/images/noavatar.png"
                      alt="user image"
                      width={40}
                      height={40}
                      className="rounded-full object-cover"
                    />
                    {transaction.name}
                  </div>
                </td>
                <td className="p-[10px] text-left">
                  <span className={`rounded-[5px] p-[5px] text-[14px] text-white ${transaction.statusColor}`}>
                    {transaction.status}
                  </span>
                </td>
                <td className="p-[10px] text-left">{transaction.date}</td>
                <td className="p-[10px] text-left">{transaction.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


      <div className="md:hidden flex flex-col gap-4">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="p-3 sm:p-4 text-white border border-[#2e374a] rounded-lg shadow-md bg-[--bgSoft]">
            <p className="text-[15px] mb-[10px]">Name: {transaction.name}</p>
            <p className="text-[15px] mb-[10px]">Status: <span className={`rounded-[5px] p-[5px] text-[12px] ${transaction.statusColor}`}>{transaction.status}</span></p>
            <p className="text-[15px] mb-[10px]">Date: {transaction.date}</p>
            <p className="text-[15px] mb-[10px]">Amount: {transaction.amount}</p>
          </div>
        ))}
      </div>

    
      <div className="flex justify-center mt-5">
        <Link href="/transactions" className="bg-[#2e374a] hover:bg-[#3d4a65] text-white px-4 py-2 rounded-md text-sm shadow">
          View All Transactions
        </Link>
      </div>
    </div>
  );
};

export default Transactions;
