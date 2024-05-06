import { BlockchainClass, Transaction } from "@/app/type";
import prismaClient from "@/lib/prisma";
import { getBlocksAsClass } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    context: { params: { address: string } }
) {
    const { address } = context.params;

    const wallet = await prismaClient.wallet.findUnique({
        where: { address },
    });

    if (!wallet) {
        return NextResponse.json(
            {
                error: "Wallet not found",
            },
            { status: 404 }
        );
    }

    const pendingTransactionsClass =
        await prismaClient.pendingTransaction.findMany({
            where: { fromAddress: address },
        });

    console.log(pendingTransactionsClass);

    const blocksClass = await getBlocksAsClass();

    const blockchainClass = new BlockchainClass(blocksClass);

    const balance = blockchainClass.getBalanceOfAddress(address);
    const transactionsClass =
        blockchainClass.getAllTransactionsForWallet(address);

    let transactions: Transaction[] = [];

    for (const tx of transactionsClass) {
        const transaction: Transaction = {
            fromAddress: tx.fromAddress,
            toAddress: tx.toAddress,
            amount: tx.amount,
            timestamp: tx.timestamp,
            signature: tx.signature,
        };

        transactions.push(transaction);
    }

    let pendingTransactions: Transaction[] = [];
    for (const tx of pendingTransactionsClass) {
        const transaction: Transaction = {
            fromAddress: tx.fromAddress,
            toAddress: tx.toAddress,
            amount: tx.amount,
            timestamp: tx.timestamp.toISOString(),
            signature: tx.signature,
        };

        pendingTransactions.push(transaction);
    }

    return NextResponse.json({
        balance,
        transactions,
        pendingTransactions,
    });
}
