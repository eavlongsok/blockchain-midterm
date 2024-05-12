"use client";

import Layout from "@/components/custom/Layout";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import CreateGenesisBlock from "./CreateGenesisBlock";
import Verification from "./Verification";
import { Block } from "./type";

async function getBlocks(): Promise<Block[]> {
    const response = await fetch("/api/blocks", { cache: "no-store" });
    const data = await response.json();
    return data.blocks;
}

export default function Page() {
    const [blocks, setBlocks] = useState<Block[]>([]);
    const [hasFetched, setHasFetched] = useState(false);

    useEffect(() => {
        async function fetchData() {
            const fetchedBlocks = await getBlocks();
            setBlocks(fetchedBlocks);
            setHasFetched(true);
        }
        fetchData();
    }, []);

    return (
        <Layout>
            <div className='mx-10 my-10'>
                <h1 className='text-3xl font-bold'>Home Page</h1>
                <div className='mt-4 flex space-x-4'>
                    <CreateGenesisBlock
                        isVisible={hasFetched && blocks.length === 0}
                        onCreate={(block) => setBlocks([{ ...block }])}
                    />
                    <Verification />
                </div>
                <div className='rounded-md border my-5'>
                    <Table className='mt-5 caption-top'>
                        <TableCaption className='font-semibold text-black text-lg'>
                            Blocks
                        </TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Timestamp</TableHead>
                                <TableHead className='max-w-[300px] break-words'>
                                    Hash
                                </TableHead>
                                <TableHead>Nonce</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {blocks.length !== 0 ? (
                                blocks.map((block, i) => {
                                    return (
                                        // change key to block.hash
                                        <TableRow key={i}>
                                            <TableCell>
                                                <a
                                                    href={`/block/${block.hash}`}
                                                >
                                                    {block.timestamp}
                                                </a>
                                            </TableCell>
                                            <TableCell className='max-w-[450px] truncate'>
                                                <a
                                                    href={`/block/${block.hash}`}
                                                >
                                                    {block.hash}
                                                </a>
                                            </TableCell>
                                            <TableCell>
                                                <a
                                                    href={`/block/${block.hash}`}
                                                >
                                                    {block.nonce}
                                                </a>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={3}
                                        className='h-24 text-center'
                                    >
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </Layout>
    );
}
