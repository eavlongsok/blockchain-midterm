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
    privateKey: string;
};
