"use client";
import { Transaction } from "@/app/type";
import Layout from "@/components/custom/Layout";
import TransactionTable from "@/components/custom/TransactionTable";
import { useEffect, useState } from "react";

export default function Page() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await fetch("/api/pending-transactions", {
                    cache: "no-store",
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch transactions");
                }
                const data = await response.json();
                setTransactions(data.pendingTransactions);
            } catch (error) {
                console.error("Error fetching transactions:", error);
            }
        };

        fetchTransactions();
    }, []);
    return (
        <Layout>
            <div className='mx-10 my-10'>
                <h1 className='text-3xl font-bold'>Pending Transactions</h1>
                <TransactionTable
                    transactions={transactions}
                    caption='Pending Transaction'
                />
            </div>
        </Layout>
    );
}
