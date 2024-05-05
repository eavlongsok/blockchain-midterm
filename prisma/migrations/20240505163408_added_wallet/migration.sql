-- CreateTable
CREATE TABLE "Wallet" (
    "address" TEXT NOT NULL,
    "privateKey" TEXT NOT NULL,

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("address")
);
