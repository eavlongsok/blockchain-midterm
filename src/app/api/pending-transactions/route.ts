import prismaClient from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    let pendingTransactions = await prismaClient.pendingTransaction.findMany({
        orderBy: { timestamp: "asc" },
    });
    return NextResponse.json({ pendingTransactions });
}

export const dynamic = "force-dynamic";
