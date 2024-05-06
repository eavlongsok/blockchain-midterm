import { Block } from "@/app/type";
import prismaClient from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    context: { params: { hash: string } }
) {
    const { hash } = context.params;
    const prismaBlock = await prismaClient.blockchain.findUnique({
        where: { hash },
    });

    let block: Block | null = null;
    if (prismaBlock !== null) {
        block = {
            data: prismaBlock.data,
            hash: prismaBlock.hash,
            nonce: prismaBlock.nonce,
            previousHash: prismaBlock.previousHash,
            timestamp: prismaBlock.timestamp.toISOString(),
        };
    }

    return NextResponse.json({ block });
}
