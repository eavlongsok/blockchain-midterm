"use client";

import { Transaction } from "@/app/type";
import Layout from "@/components/custom/Layout";
import TransactionTable from "@/components/custom/TransactionTable";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import MinePendingTransactions from "./MinePendingTransactions";

async function getWalletInformation(address: string): Promise<{
    balance: number;
    transactions: Transaction[];
    pendingTransactions: Transaction[];
} | null> {
    try {
        const response = await fetch(`/api/wallets/${address}`, {
            cache: "no-store",
        });
        const json = await response.json();

        if (response.status !== 200) {
            throw new Error(json.error);
        }

        return json;
    } catch (err) {
        console.log(err);
        return null;
    }
}

export default function Page({ params }: { params: { address: string } }) {
    const [balance, setBalance] = useState<number>(0);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [pendingTransactions, setPendingTransactions] = useState<
        Transaction[]
    >([]);
    const [walletExists, setWalletExists] = useState<boolean>(true);
    const [mineSuccess, setMineSuccess] = useState(false);

    useEffect(() => {
        async function fetchData() {
            const data = await getWalletInformation(params.address);
            if (data === null) {
                setWalletExists(false);
                return;
            }
            setBalance(data.balance);
            setTransactions(data.transactions);
            setPendingTransactions(data.pendingTransactions);
        }
        fetchData();
    }, [params.address, mineSuccess]);

    return (
        <Layout>
            <div className='mx-10 my-10 '>
                {!walletExists && (
                    <p className='text-red-500 font-bold text-lg'>
                        Wallet Not Found
                    </p>
                )}
                <h1 className='text-3xl font-bold max-w-[80vw] break-words'>
                    Wallet {params.address}
                </h1>
                <h2 className='text-xl font-bold mt-4'>
                    Balance: ${balance.toLocaleString("en")}
                </h2>
                <div className='mt-4 flex space-x-4'>
                    <a href={`/create-transaction/${params.address}`}>
                        <Button>Send</Button>
                    </a>
                    <MinePendingTransactions
                        address={params.address}
                        onMineSuccess={() => setMineSuccess(true)}
                    />
                </div>

                <TransactionTable transactions={transactions} />
                <br />
                <br />
                <TransactionTable
                    transactions={pendingTransactions}
                    caption='Pending Transactions'
                />
            </div>
        </Layout>
    );
}
