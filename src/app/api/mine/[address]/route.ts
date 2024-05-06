import { BlockchainClass } from "@/app/type";
import prismaClient from "@/lib/prisma";
import { getBlocksAsClass, getPendingTransactionsAsClass } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function POST(
    request: Request,
    context: { params: { address: string } }
) {
    const { address } = context.params;

    const pendingTransactions = await getPendingTransactionsAsClass();
    if (pendingTransactions.length === 0) {
        return NextResponse.json({
            success: false,
        });
    }

    const blocks = await getBlocksAsClass();

    const blockchain = new BlockchainClass(blocks);
    const blockNumberBeforeMining = blockchain.chain.length;
    blockchain.pendingTransactions = pendingTransactions;
    blockchain.minePendingTransactions(address);

    const latestMinedBlock = blockchain.getLatestBlock();

    const blockNumberAfterMining = blockchain.chain.length;

    // insert new block into database
    await prismaClient.blockchain.create({
        data: {
            timestamp: new Date(latestMinedBlock.timestamp),
            previousHash: latestMinedBlock.previousHash,
            hash: latestMinedBlock.hash,
            data: JSON.stringify(latestMinedBlock.transactions),
            nonce: latestMinedBlock.nonce,
        },
    });

    return NextResponse.json({
        success: blockNumberAfterMining > blockNumberBeforeMining,
    });
}
