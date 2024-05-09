import ec from "@/lib/ec";
import { createHash } from "crypto";
import EC from "elliptic";

export type Block = {
    timestamp: string;
    data: string;
    hash: string;
    previousHash: string;
    nonce: number;
};

export type Transaction = {
    timestamp: string;
    fromAddress: string;
    toAddress: string;
    amount: number;
    signature: string;
};

export type Wallet = {
    address: string;
    privateKey?: string;
};

export class TransactionClass {
    timestamp: string;
    fromAddress: string;
    toAddress: string;
    amount: number;
    signature: string;

    constructor(
        timestamp: string,
        fromAddress: string,
        toAddress: string,
        amount: number,
        signature: string
    ) {
        this.timestamp = timestamp;
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
        this.signature = signature;
    }

    calculateHash(): string {
        return createHash("sha256")
            .update(
                this.fromAddress + this.toAddress + this.amount + this.timestamp
            )
            .digest("hex");
    }

    sign(key: EC.ec.KeyPair) {
        if (key.getPublic("hex") !== this.fromAddress) {
            throw new Error("You cannot sign transactions for other wallets!");
        }

        const hash = this.calculateHash();
        const signature = key.sign(hash, "base64");

        this.signature = signature.toDER("hex");
    }

    public isValid(): boolean {
        // the plan is to make an official wallet for the blockchain, which will supply the "coin"
        // so we will check if fromAddress is null, then we return false

        if (this.fromAddress.length === 0 || this.toAddress.length === 0)
            return false;

        if (this.signature.length === 0) {
            return false;
        }

        const publicKey = ec.keyFromPublic(this.fromAddress, "hex");
        return publicKey.verify(this.calculateHash(), this.signature);
    }
}

export class BlockClass {
    timestamp: string;
    transactions: TransactionClass[];
    hash: string;
    previousHash: string;
    nonce: number;

    constructor(
        timestamp: string,
        transactions: TransactionClass[],
        hash: string,
        previousHash: string,
        nonce: number = 0
    ) {
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = hash.length > 0 ? hash : this.calculateHash();
        this.nonce = nonce || 0;
    }

    calculateHash(): string {
        return createHash("sha256")
            .update(
                this.previousHash +
                    this.timestamp +
                    JSON.stringify(this.transactions) +
                    this.nonce
            )
            .digest("hex");
    }

    mineBlock(difficulty: number): void {
        while (
            this.hash.substring(0, difficulty) !==
            Array(difficulty + 1).join("0")
        ) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
    }

    hasValidTransactions(): boolean {
        for (const tx of this.transactions) {
            if (!tx.isValid()) {
                return false;
            }
        }
        return true;
    }
}

export class BlockchainClass {
    chain: BlockClass[];
    difficulty: number;
    pendingTransactions: TransactionClass[];
    miningReward: number;

    constructor(blocks: BlockClass[]) {
        this.chain = blocks;
        this.difficulty = parseInt(process.env.DIFFICULTY || "4");
        this.pendingTransactions = [];
        this.miningReward = parseInt(process.env.MINING_REWARD || "100");
    }

    createGenesisBlock() {
        if (this.chain.length > 0) {
            throw new Error("Genesis block already exists!");
        }
        const tx = new TransactionClass(
            new Date("2000-01-01").toISOString(),
            "",
            process.env.OFFICIAL_WALLET_ADDRESS as string,
            200_000_000_000,
            ""
        );

        const block = new BlockClass(
            new Date("2000-01-01").toISOString(),
            [tx],
            "",
            ""
        );

        this.chain = [block];
    }

    getLatestBlock(): BlockClass {
        return this.chain[this.chain.length - 1];
    }

    minePendingTransactions(miningRewardAddress: string) {
        if (this.pendingTransactions.length === 0) {
            throw new Error("There are no pending transactions to mine");
        }

        if (this.chain.length === 0) {
            throw new Error("Genesis block does not exist");
        }

        if (miningRewardAddress.length === 0) {
            throw new Error("Invalid mining reward address");
        }

        if (miningRewardAddress === process.env.OFFICIAL_WALLET_ADDRESS) {
            throw new Error("Cannot send mining reward to the official wallet");
        }

        const rewardTx = new TransactionClass(
            new Date(Date.now()).toISOString(),
            process.env.OFFICIAL_WALLET_ADDRESS as string,
            miningRewardAddress,
            this.miningReward,
            ""
        );
        rewardTx.sign(
            ec.keyFromPrivate(process.env.OFFCIAL_WALLET_PRIVATE_KEY as string)
        );

        this.pendingTransactions.push(rewardTx);

        const block = new BlockClass(
            new Date(Date.now()).toISOString(),
            this.pendingTransactions,
            "",
            this.getLatestBlock().hash
        );

        block.mineBlock(this.difficulty);

        this.chain.push(block);

        this.pendingTransactions = [];
    }

    addTransaction(transaction: TransactionClass) {
        if (
            transaction.fromAddress.length === 0 ||
            transaction.toAddress.length === 0
        ) {
            throw new Error("Transaction must include from and to address");
        }

        if (!transaction.isValid()) {
            throw new Error("Cannot add invalid transaction to chain");
        }

        if (transaction.fromAddress === transaction.toAddress) {
            throw new Error("Cannot send coins to yourself");
        }

        if (transaction.amount <= 0) {
            throw new Error("Transaction amount should be higher than 0");
        }

        const walletBalance = this.getBalanceOfAddress(transaction.fromAddress);

        if (walletBalance < transaction.amount) {
            throw new Error("Not enough balance");
        }

        const pendingTxForWallet = this.pendingTransactions.filter(
            (tx) => tx.fromAddress === transaction.fromAddress
        );

        if (pendingTxForWallet.length > 0) {
            const totalPendingAmount = pendingTxForWallet
                .map((tx) => tx.amount)
                .reduce((prev, curr) => prev + curr);

            const totalAmount = totalPendingAmount + transaction.amount;
            if (totalAmount > walletBalance) {
                throw new Error(
                    "Pending transactions for this wallet is higher than its balance."
                );
            }
        }

        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address: string): number {
        let balance = 0;

        for (const block of this.chain) {
            for (const trans of block.transactions) {
                if (trans.fromAddress === address) {
                    balance -= trans.amount;
                }

                if (trans.toAddress === address) {
                    balance += trans.amount;
                }
            }
        }
        return balance;
    }

    getAllTransactionsForWallet(address: string): TransactionClass[] {
        const transactions = [];

        for (const block of this.chain) {
            for (const tx of block.transactions) {
                if (tx.fromAddress === address || tx.toAddress === address) {
                    transactions.push(tx);
                }
            }
        }

        return transactions;
    }

    isChainValid(): boolean {
        // Check if the Genesis block hasn't been tampered with by comparing
        // the output of createGenesisBlock with the first block on our chain
        const tmpBlockchain = new BlockchainClass([]);
        tmpBlockchain.createGenesisBlock();
        const realGenesis = JSON.stringify(tmpBlockchain.chain[0]);

        if (realGenesis !== JSON.stringify(this.chain[0])) {
            return false;
        }

        // Check the remaining blocks on the chain to see if there hashes and
        // signatures are correct
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (previousBlock.hash !== currentBlock.previousHash) {
                return false;
            }

            if (!currentBlock.hasValidTransactions()) {
                return false;
            }

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }
        }

        return true;
    }
}
