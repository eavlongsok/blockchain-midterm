import { NextResponse } from "next/server";
import prismaClient from "@/lib/prisma";

export async function GET() {
    let pendingTransactions = await prismaClient.pendingTransaction.findMany({
        orderBy: { timestamp: "asc" },
    });
    return NextResponse.json({ pendingTransactions });
}
