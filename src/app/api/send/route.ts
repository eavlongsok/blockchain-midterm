import { TransactionClass } from "@/app/type";
import ec from "@/lib/ec";
import prismaClient from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const { fromAddress, toAddress, amount } = await request.json();

    // validate wallet addresses
    if (!fromAddress || !toAddress || !amount) {
        return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    if (fromAddress === toAddress) {
        return NextResponse.json(
            { error: "Sender and receiver addresses are the same" },
            { status: 400 }
        );
    }

    const senderWallet = await prismaClient.wallet.findUnique({
        where: { address: fromAddress },
    });

    if (!senderWallet) {
        return NextResponse.json(
            { error: "Sender wallet not found" },
            { status: 404 }
        );
    }

    const receiverWallet = await prismaClient.wallet.findUnique({
        where: { address: toAddress },
    });

    if (!receiverWallet) {
        return NextResponse.json(
            { error: "Receiver wallet not found" },
            { status: 404 }
        );
    }

    const transactionClass = new TransactionClass(
        new Date(Date.now()).toISOString(),
        fromAddress,
        toAddress,
        amount,
        "" // signature
    );

    let senderPrivateKey = "";
    if (senderWallet.address === process.env.OFFICIAL_WALLET_ADDRESS) {
        senderPrivateKey = process.env.OFFICIAL_WALLET_PRIVATE_KEY as string;
    } else {
        senderPrivateKey = senderWallet.privateKey ?? "";
    }

    const key = ec.keyFromPrivate(senderPrivateKey, "hex");

    transactionClass.sign(key);

    await prismaClient.pendingTransaction.create({
        data: {
            timestamp: transactionClass.timestamp,
            fromAddress: transactionClass.fromAddress,
            toAddress: transactionClass.toAddress,
            amount: transactionClass.amount,
            signature: transactionClass.signature,
        },
    });

    return NextResponse.json({
        message: "Transaction added to pending transaction list",
    });
}
