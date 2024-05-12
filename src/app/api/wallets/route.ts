import prismaClient from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    let wallets = await prismaClient.wallet.findMany();
    wallets = wallets.map((wallet) => {
        return {
            address: wallet.address,
            privateKey: null,
        };
    });

    return NextResponse.json({ wallets });
}

export const dynamic = "force-dynamic";
