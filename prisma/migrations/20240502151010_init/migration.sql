-- CreateTable
CREATE TABLE "Blockchain" (
    "data" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "previousHash" TEXT NOT NULL,
    "timestamp" TIMESTAMPTZ(3) NOT NULL,
    "nonce" INTEGER NOT NULL,

    CONSTRAINT "Blockchain_pkey" PRIMARY KEY ("hash")
);

-- CreateIndex
CREATE UNIQUE INDEX "Blockchain_previousHash_key" ON "Blockchain"("previousHash");
