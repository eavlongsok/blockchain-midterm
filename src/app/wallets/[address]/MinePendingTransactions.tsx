"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function MinePendingTransactions({
    address,
}: {
    address: string;
}) {
    const [disabled, setDisabled] = useState(true);
    const router = useRouter();
    useEffect(() => {
        async function checkPendingTransactions() {
            const response = await fetch("/api/pending-transactions");
            const data = await response.json();
            setDisabled(data.pendingTransactions.length === 0);
        }
        checkPendingTransactions();
    }, []);
    async function handleClick() {
        const response = await fetch(`/api/mine/${address}`, {
            method: "POST",
        });
        const data = await response.json();
        if (data.success) {
            alert("Successfully mined pending transactions!");
            router.push(`/wallets/${address}`);
        } else {
            alert("Failed to mine pending transactions.");
        }
    }
    return (
        <Button onClick={handleClick} disabled={disabled}>
            Mine Pending Transactions
        </Button>
    );
}
