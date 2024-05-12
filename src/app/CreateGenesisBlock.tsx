"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Block } from "./type";

export default function CreateGenesisBlock({
    isVisible: visible,
    onCreate,
}: {
    isVisible: boolean;
    onCreate: (block: Block) => void;
}) {
    const [isButtonVisible, setIsButtonVisible] = useState(false);

    useEffect(() => {
        setIsButtonVisible(visible);
    }, [visible]);

    async function handleClick() {
        const response = await fetch("/api/blocks/create-genesis-block", {
            method: "POST",
            cache: "no-store",
        });
        const json = await response.json();

        if (response.status === 200) {
            onCreate(json.block);
            setIsButtonVisible(false);
        } else {
            alert(json.error);
        }
    }

    return (
        isButtonVisible && (
            <Button onClick={handleClick}>Create Genesis Block</Button>
        )
    );
}
