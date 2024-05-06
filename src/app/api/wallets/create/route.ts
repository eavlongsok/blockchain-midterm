import ec from "@/lib/ec";
import prismaClient from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST() {
    let publicKey, privateKey: string;
    while (true) {
        const keyPair = ec.genKeyPair();
        publicKey = keyPair.getPublic("hex");
        privateKey = keyPair.getPrivate("hex");

        let wallet = await prismaClient.wallet.findUnique({
            where: {
                address: publicKey,
            },
        });

        if (!wallet) {
            break;
        }
    }

    let wallet = await prismaClient.wallet.create({
        data: {
            address: publicKey,
            privateKey,
        },
    });

    wallet.privateKey = null;

    return NextResponse.json({ wallet });
}
