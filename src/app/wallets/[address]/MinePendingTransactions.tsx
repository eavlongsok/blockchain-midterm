"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function MinePendingTransactions({
    address,
    onMineSuccess
}: {
    address: string;
    onMineSuccess: () => void;
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

    async function minePendingTransactions(
        address: string
    ): Promise<{ success: boolean; message: string }> {
        try {
            const response = await fetch(`/api/mine/${address}`, {
                method: "POST",
            });
            const json = await response.json();
            if (!response.ok) {
                throw new Error(json.message);
            }
            return { success: true, message: json.message };
        } catch (err: any) {
            return { success: false, message: err.message };
        }
    }

    async function handleClick() {
        const data = await minePendingTransactions(address);
        alert(data.message);
        onMineSuccess();
    }

    return (
        <Button onClick={handleClick} disabled={disabled}>
            Mine Pending Transactions
        </Button>
    );
}
