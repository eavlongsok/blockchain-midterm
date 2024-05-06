import { Block, BlockchainClass } from "@/app/type";
import prismaClient from "@/lib/prisma";
import { getBlocksAsClass } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function POST() {
    const blocks = await getBlocksAsClass();
    let block: Block;

    try {
        const blockchain = new BlockchainClass(blocks);
        blockchain.createGenesisBlock();
        const blockClass = blockchain.getLatestBlock();

        // add to database
        const newBlock = await prismaClient.blockchain.create({
            data: {
                data: JSON.stringify(blockClass.transactions),
                hash: blockClass.hash,
                previousHash: blockClass.previousHash,
                nonce: blockClass.nonce,
                timestamp: blockClass.timestamp,
            },
        });

        block = {
            data: newBlock.data,
            hash: newBlock.hash,
            nonce: newBlock.nonce,
            previousHash: newBlock.previousHash,
            timestamp: newBlock.timestamp.toISOString(),
        };
    } catch (err: any) {
        return NextResponse.json({
            error: err.message,
        });
    }

    // create wallet if not exist
    try {
        await prismaClient.wallet.create({
            data: {
                address: process.env.OFFICIAL_WALLET_ADDRESS as string,
                privateKey: null,
            },
        });
    } catch (err) {
        console.log(err);
    }

    return NextResponse.json({ block });
}
