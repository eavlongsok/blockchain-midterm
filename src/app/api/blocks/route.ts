import { NextResponse } from "next/server";
import prismaClient from "@/lib/prisma";

export async function GET() {
    let blocks = await prismaClient.blockchain.findMany({
        orderBy: { timestamp: "asc" },
    });
    return NextResponse.json({ blocks });
}
