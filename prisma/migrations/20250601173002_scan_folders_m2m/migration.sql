-- CreateTable
CREATE TABLE "ScanFolder" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ScanFolder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScanFolderOnScan" (
    "scanFolderId" TEXT NOT NULL,
    "seoScanId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ScanFolderOnScan_pkey" PRIMARY KEY ("scanFolderId","seoScanId")
);

-- AddForeignKey
ALTER TABLE "ScanFolder" ADD CONSTRAINT "ScanFolder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScanFolderOnScan" ADD CONSTRAINT "ScanFolderOnScan_scanFolderId_fkey" FOREIGN KEY ("scanFolderId") REFERENCES "ScanFolder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScanFolderOnScan" ADD CONSTRAINT "ScanFolderOnScan_seoScanId_fkey" FOREIGN KEY ("seoScanId") REFERENCES "SeoScan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
