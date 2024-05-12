"use client";

import Layout from "@/components/custom/Layout";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Wallet } from "@prisma/client";
import { useEffect, useState } from "react";
import CreateWallet from "./CreateWallet";

export default function Page() {
    const [wallets, setWallets] = useState<Wallet[]>([]);

    useEffect(() => {
        async function fetchWallets() {
            const response = await fetch("/api/wallets", { cache: "no-store" });
            const json = await response.json();
            const wallets: Wallet[] = json.wallets;

            setWallets(wallets);
        }
        fetchWallets();
    }, []);
    return (
        <Layout>
            <div className='mx-10 my-10'>
                <h1 className='text-3xl font-bold'>Wallets</h1>
                <div className='mt-4'>
                    <CreateWallet
                        onCreate={(newWallet) =>
                            setWallets((prev) => [...prev, newWallet])
                        }
                    />
                </div>
                <div className='rounded-md border my-5'>
                    <Table className='mt-5'>
                        <TableHeader>
                            <TableRow>
                                <TableHead>No.</TableHead>
                                <TableHead>Address</TableHead>
                                <TableHead className='text-center'>
                                    Action
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {wallets.length !== 0 ? (
                                wallets.map((wallet, i) => {
                                    return (
                                        // change key to wallet.address
                                        <TableRow key={i}>
                                            <TableCell>
                                                <a
                                                    href={`/wallets/${wallet.address}`}
                                                >
                                                    {i + 1}
                                                </a>
                                            </TableCell>
                                            <TableCell>
                                                <a
                                                    href={`/wallets/${wallet.address}`}
                                                >
                                                    {wallet.address}
                                                </a>
                                            </TableCell>
                                            <TableCell className='flex justify-center'>
                                                <Button
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(
                                                            wallet.address
                                                        );
                                                        alert(
                                                            "Copied to clipboard!"
                                                        );
                                                    }}
                                                >
                                                    Copy Address
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={3}
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
        </Layout>
    );
}
