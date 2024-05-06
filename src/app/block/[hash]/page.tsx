import { Block, Transaction } from "@/app/type";
import TransactionTable from "@/components/custom/TransactionTable";
import { convertBlockObjToClass } from "@/lib/utils";

async function getBlockDetail(hash: string): Promise<Block | null> {
    const response = await fetch(`${process.env.NEXT_URL}/api/blocks/${hash}`);
    const json = await response.json();
    return json.block;
}

export default async function Page({
    params,
}: {
    params: {
        hash: string;
    };
}) {
    const block = await getBlockDetail(params.hash);
    if (block === null) {
        return (
            <div className='font-bold text-2xl flex justify-center mt-4'>
                Block not found
            </div>
        );
    }
    const blockClass = convertBlockObjToClass(block);

    return (
        <div className='mx-10 my-10'>
            <h1 className='text-3xl font-bold'>Block {params.hash}</h1>
            <TransactionTable transactions={blockClass.transactions} />
        </div>
    );
}
