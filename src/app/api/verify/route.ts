import { BlockchainClass } from "@/app/type";
import { getBlocksAsClass } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function GET() {
    const blocksClass = await getBlocksAsClass();
    const blockchainClass = new BlockchainClass(blocksClass);
    const isValid = blockchainClass.isChainValid();
    return NextResponse.json({ valid: isValid });
}

export const dynamic = "force-dynamic";
