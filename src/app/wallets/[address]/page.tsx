import { Transaction } from "@/app/type";
import TransactionTable from "@/components/custom/TransactionTable";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import MinePendingTransactions from "./MinePendingTransactions";

async function getWalletInformation(address: string): Promise<{
    balance: number;
    transactions: Transaction[];
    pendingTransactions: Transaction[];
} | null> {
    try {
        const response = await fetch(
            `${process.env.NEXT_URL}/api/wallets/${address}`,
            {
                cache: "no-cache",
            }
        );
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

export default async function Page({
    params,
}: {
    params: { address: string };
}) {
    const data = await getWalletInformation(params.address);

    if (data === null) {
        return (
            <div className='font-bold text-2xl flex justify-center mt-4'>
                Wallet not found
            </div>
        );
    }

    const { balance, transactions, pendingTransactions } = data;
    return (
        <div className='mx-10 my-10 '>
            <h1 className='text-3xl font-bold max-w-[80vw] break-words'>
                Wallet {params.address}
            </h1>
            <h2 className='text-xl font-bold mt-4'>
                Balance: ${balance.toLocaleString("en")}
            </h2>
            <div className='mt-4 flex space-x-4'>
                <Link href={`/create-transaction/${params.address}`}>
                    <Button>Send</Button>
                </Link>
                <MinePendingTransactions address={params.address} />
            </div>

            <TransactionTable transactions={transactions} />
            <br />
            <br />
            <TransactionTable
                transactions={pendingTransactions}
                caption='Pending Transactions'
            />
        </div>
    );
}
