import { Transaction } from "@/app/type";
import TransactionTable from "@/components/custom/TransactionTable";

const transaction: Transaction = {
    timestamp: "2021-10-10 12:00:00",
    fromAddress: "0x1234567890abcdef",
    toAddress: "0xabcdef1234567890",
    amount: 100.25,
    signature: "f13i1bnuihd134",
};

const transactions: Transaction[] = [
    transaction,
    transaction,
    transaction,
    transaction,
    transaction,
];

export default function Page() {
    return (
        <div className='mx-10 my-10'>
            <h1 className='text-3xl font-bold'>Pending Transactions</h1>
            <TransactionTable transactions={transactions} />
        </div>
    );
}
