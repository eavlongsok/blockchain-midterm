import { BlockchainClass } from "@/app/type";
import { getBlocksAsClass } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function GET() {
    const blocksClass = await getBlocksAsClass();
    console.log({ blocksClass });
    const blockchainClass = new BlockchainClass(blocksClass);
    const isValid = blockchainClass.isChainValid();
    console.log(isValid);
    return NextResponse.json({ valid: isValid });
}
