-- CreateTable
CREATE TABLE "CustomerFollowUp" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CustomerFollowUp_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CustomerFollowUp" ADD CONSTRAINT "CustomerFollowUp_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
