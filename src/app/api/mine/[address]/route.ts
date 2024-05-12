import { BlockchainClass } from "@/app/type";
import prismaClient from "@/lib/prisma";
import { getBlocksAsClass, getPendingTransactionsAsClass } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function POST(
    request: Request,
    context: { params: { address: string } }
) {
    const { address } = context.params;

    try {
        // Get pending transactions
        const pendingTransactions = await getPendingTransactionsAsClass();

        // If no pending transactions, return error
        if (pendingTransactions.length === 0) {
            return NextResponse.json({
                success: false,
                message: "There are no pending transactions to mine",
            });
        }

        const wallet = await prismaClient.wallet.findUnique({
            where: { address },
        });

        // If wallet not found, return error
        if (!wallet) {
            return NextResponse.json(
                { success: false, message: "Wallet not found" },
                { status: 404 }
            );
        }

        // Get blocks
        const blocks = await getBlocksAsClass();

        // Create blockchain instance
        const blockchain = new BlockchainClass(blocks, pendingTransactions);

        // Mine pending transactions
        blockchain.minePendingTransactions(address);

        // Get the latest mined block
        const latestMinedBlock = blockchain.getLatestBlock();

        // Insert new block into the database
        await prismaClient.blockchain.create({
            data: {
                timestamp: new Date(latestMinedBlock.timestamp),
                previousHash: latestMinedBlock.previousHash,
                hash: latestMinedBlock.hash,
                data: JSON.stringify(latestMinedBlock.transactions),
                nonce: latestMinedBlock.nonce,
            },
        });

        await prismaClient.pendingTransaction.deleteMany();

        // Return success response
        return NextResponse.json({
            success: true,
            message: "Block mined successfully",
        });
    } catch (err: any) {
        console.log(err.message);
        // Return error response
        return NextResponse.json(
            {
                success: false,
                message: err.message,
            },
            { status: 500 }
        );
    }
}

export const dynamic = "force-dynamic";
