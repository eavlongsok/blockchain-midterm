import { BlockchainClass } from "@/app/type";
import prismaClient from "@/lib/prisma";
import { getBlocksAsClass } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    context: { params: { address: string } }
) {
    const { address } = context.params;

    const pendingTransactions = await prismaClient.pendingTransaction.findMany({
        where: { fromAddress: address },
    });

    const blocksClass = await getBlocksAsClass();

    const blockchainClass = new BlockchainClass(blocksClass);

    const balance = blockchainClass.getBalanceOfAddress(address);
    const transactions = blockchainClass.getAllTransactionsForWallet(address);

    return NextResponse.json({ balance, transactions, pendingTransactions });
}
