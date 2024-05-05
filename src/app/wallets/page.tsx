import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Wallet } from "@prisma/client";
import Link from "next/link";

const wallet: Wallet = {
    address: "0x1234567890abcdef",
    privateKey: "0xabcdef1234567890",
};

const wallets: Wallet[] = [wallet, wallet, wallet, wallet, wallet];

export default function Page() {
    return (
        <div className='mx-10 my-10'>
            <h1 className='text-3xl font-bold'>Wallets</h1>
            <div className='rounded-md border my-5'>
                <Table className='mt-5'>
                    <TableHeader>
                        <TableRow>
                            <TableHead>No.</TableHead>
                            <TableHead>Address</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {wallets.length !== 0 ? (
                            wallets.map((wallet, i) => {
                                return (
                                    // change key to wallet.address
                                    <TableRow key={i}>
                                        <TableCell>
                                            <Link
                                                href={`/wallets/${wallet.address}`}
                                            >
                                                {i + 1}
                                            </Link>
                                        </TableCell>
                                        <TableCell>
                                            <Link
                                                href={`/wallets/${wallet.address}`}
                                            >
                                                {wallet.address}
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={4}
                                    className='h-24 text-center'
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
