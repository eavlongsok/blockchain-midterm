"use client";
import Layout from "@/components/custom/Layout";
import { Transaction } from "@/app/type";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

async function createTransaction(
    from: string,
    to: string,
    amount: number
): Promise<{
    success: boolean;
    message: string;
}> {
    try {
        const response = await fetch("/api/send", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ fromAddress: from, toAddress: to, amount }),
        });

        const json = await response.json();

        if (!response.ok) {
            throw new Error(json.error);
        }

        return { success: true, message: json.message };
    } catch (err: any) {
        return { success: false, message: err.message };
    }
}

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
    const toAddressInput = useRef<HTMLInputElement>(null);
    const amountInput = useRef<HTMLInputElement>(null);
    const router = useRouter();
    const [balance, setBalance] = useState<number>(0);

    useEffect(() => {
        async function fetchData() {
            const data = await getWalletInformation(params.address);

            if (data === null) {
                return;
            }

            setBalance(data.balance);
        }

        fetchData();
    }),
        [];

    async function handleSubmit() {
        const toAddress = toAddressInput.current?.value ?? "";
        const amount = amountInput.current?.value ?? "";

        if (!toAddress || !amount) {
            alert("Please fill in all fields");
            return;
        }

        const result = await createTransaction(
            params.address,
            toAddress,
            parseInt(amount)
        );

        alert(result.message);

        if (result.success) {
            router.push(`/wallets/${params.address}`);
        }
    }

    return (
        <Layout>
            <div className='mx-10 my-10'>
                <h1 className='text-3xl font-bold'>Create Transaction</h1>
                <h2 className='text-xl font-bold mt-4'>
                    Balance: ${balance.toLocaleString("en")}
                </h2>
                <div className='flex justify-center'>
                    <Card className='w-[500px] mt-32'>
                        <CardHeader>
                            <CardTitle>Create transaction</CardTitle>
                            <CardDescription>
                                Send money to another wallet in a few clicks
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className='grid w-full items-center gap-4'>
                                <div className='flex flex-col space-y-1.5'>
                                    <Label htmlFor='from'>From</Label>
                                    <Input
                                        id='from'
                                        value={params.address}
                                        disabled
                                    />
                                </div>
                                <div className='flex flex-col space-y-1.5'>
                                    <Label htmlFor='to'>To</Label>
                                    <Input
                                        id='to'
                                        placeholder='Address of receiver'
                                        ref={toAddressInput}
                                    />
                                </div>
                                <div className='flex flex-col space-y-1.5'>
                                    <Label htmlFor='amount'>Amount</Label>
                                    <Input
                                        id='amount'
                                        placeholder='Amount to send'
                                        type='number'
                                        ref={amountInput}
                                    />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className='w-full' onClick={handleSubmit}>
                                Send
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </Layout>
    );
}
