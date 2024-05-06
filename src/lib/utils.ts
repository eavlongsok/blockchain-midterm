import { Block, BlockClass, Transaction, TransactionClass } from "@/app/type";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import prismaClient from "./prisma";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export async function getBlocksAsClass(): Promise<BlockClass[]> {
    const blockchain = await prismaClient.blockchain.findMany();
    let blocksClass: BlockClass[] = [];
    // convert blockchain to class instances
    for (const block of blockchain) {
        let transactions: TransactionClass[] = [];
        const transactionString = block.data;
        const transactionObjects: Transaction[] = JSON.parse(transactionString);

        for (const obj of transactionObjects) {
            const tx = new TransactionClass(
                obj.timestamp,
                obj.fromAddress,
                obj.toAddress,
                obj.amount,
                obj.signature
            );

            transactions.push(tx);
        }

        const blockClass = new BlockClass(
            block.timestamp.toISOString(),
            transactions,
            block.hash,
            block.previousHash,
            block.nonce
        );

        blocksClass.push(blockClass);
    }

    return blocksClass;
}

export async function getPendingTransactionsAsClass(): Promise<
    TransactionClass[]
> {
    const pendingTransactions =
        await prismaClient.pendingTransaction.findMany();

    let pendingTransactionsClass: TransactionClass[] = [];

    for (const tx of pendingTransactions) {
        const txClass = new TransactionClass(
            tx.timestamp.toISOString(),
            tx.fromAddress,
            tx.toAddress,
            tx.amount,
            tx.signature
        );

        pendingTransactionsClass.push(txClass);
    }

    return pendingTransactionsClass;
}

export function convertBlockObjToClass(blockObj: Block): BlockClass {
    let transactions: TransactionClass[] = [];
    const transactionString = blockObj.data;
    const transactionObjects: Transaction[] = JSON.parse(transactionString);

    for (const obj of transactionObjects) {
        const tx = new TransactionClass(
            obj.timestamp,
            obj.fromAddress,
            obj.toAddress,
            obj.amount,
            obj.signature
        );

        transactions.push(tx);
    }

    return new BlockClass(
        blockObj.timestamp,
        transactions,
        blockObj.hash,
        blockObj.previousHash,
        blockObj.nonce
    );
}
