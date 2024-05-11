import { NextResponse } from "next/server";
import { BlockchainClass } from "@/app/type";
import prismaClient from "@/lib/prisma";
import { getPendingTransactionsAsClass, getBlocksAsClass } from "@/lib/utils";

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

        // Get blocks
        const blocks = await getBlocksAsClass();

        // Create blockchain instance
        const blockchain = new BlockchainClass(blocks);

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

        // Return success response
        return NextResponse.json({
            success: true,
            message: "Block mined successfully",
            block: latestMinedBlock,
        });
    } catch (error) {
        // Return error response
        return NextResponse.json({
            success: false,
            message: "Block mined Failed",
        });
    }
}
