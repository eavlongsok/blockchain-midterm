import { Transaction } from "@/app/type";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export default function TransactionTable({
    transactions,
    caption = "Transactions",
}: {
    transactions: Transaction[];
    caption?: string;
}) {
    return (
        <div className='rounded-md border my-5'>
            <Table className='mt-5 caption-top'>
                <TableCaption className='font-semibold text-black text-lg'>
                    {caption}
                </TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Timestamp</TableHead>
                        <TableHead className='max-w-[200px] break-words'>
                            From
                        </TableHead>
                        <TableHead className='max-w-[200px] break-words'>
                            To
                        </TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead className='max-w-[200px] break-words'>
                            Signature
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {transactions.length !== 0 ? (
                        transactions.map((transaction, i) => {
                            return (
                                // change key to transaction.signature
                                <TableRow key={i}>
                                    <TableCell>
                                        {transaction.timestamp}
                                    </TableCell>
                                    <TableCell className='max-w-[200px] truncate'>
                                        {transaction.fromAddress.length > 0 ? (
                                            <a
                                                href={`/wallets/${transaction.fromAddress}`}
                                            >
                                                {transaction.fromAddress}
                                            </a>
                                        ) : (
                                            <>{transaction.fromAddress}</>
                                        )}
                                    </TableCell>
                                    <TableCell className='max-w-[200px] truncate'>
                                        <a
                                            href={`/wallets/${transaction.toAddress}`}
                                        >
                                            {transaction.toAddress}
                                        </a>
                                    </TableCell>
                                    <TableCell>{transaction.amount}</TableCell>
                                    <TableCell className='max-w-[200px] truncate'>
                                        {transaction.signature}
                                    </TableCell>
                                </TableRow>
                            );
                        })
                    ) : (
                        <TableRow>
                            <TableCell colSpan={5} className='h-24 text-center'>
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
