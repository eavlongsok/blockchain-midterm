import { Transaction } from "@/app/type";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export default function TransactionTable({
    transactions,
}: {
    transactions: Transaction[];
}) {
    return (
        <div className='rounded-md border my-5'>
            <Table className='mt-5'>
                <TableHeader>
                    <TableRow>
                        <TableHead>Timestamp</TableHead>
                        <TableHead className='max-w-[300px] break-words'>
                            From
                        </TableHead>
                        <TableHead className='max-w-[300px] break-words'>
                            To
                        </TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead className='max-w-[300px] break-words'>
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
                                    <TableCell className='max-w-[450px] truncate'>
                                        {transaction.fromAddress}
                                    </TableCell>
                                    <TableCell className='max-w-[450px] truncate'>
                                        {transaction.toAddress}
                                    </TableCell>
                                    <TableCell>{transaction.amount}</TableCell>
                                    <TableCell className='max-w-[450px] truncate'>
                                        {transaction.signature}
                                    </TableCell>
                                </TableRow>
                            );
                        })
                    ) : (
                        <TableRow>
                            <TableCell colSpan={4} className='h-24 text-center'>
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
