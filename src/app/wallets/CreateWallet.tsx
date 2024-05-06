import { Button } from "@/components/ui/button";
import { Wallet } from "@prisma/client";

export default function CreateWallet({
    onCreate,
}: {
    onCreate: (wallet: Wallet) => void;
}) {
    async function handleClick() {
        const response = await fetch("/api/wallets/create", {
            method: "POST",
        });

        const json = await response.json();
        const wallet: Wallet = json.wallet;
        onCreate(wallet);
    }

    return <Button onClick={handleClick}>Create Wallet</Button>;
}
