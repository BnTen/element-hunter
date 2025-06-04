/*
  Warnings:

  - The primary key for the `SeoScan` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "SeoScan" DROP CONSTRAINT "SeoScan_pkey",
ADD COLUMN     "h2" TEXT[],
ADD COLUMN     "h3" TEXT[],
ADD COLUMN     "images" JSONB,
ADD COLUMN     "links" JSONB,
ADD COLUMN     "manifest" JSONB,
ADD COLUMN     "metaTags" JSONB,
ADD COLUMN     "rawData" JSONB,
ADD COLUMN     "scripts" JSONB,
ADD COLUMN     "styles" JSONB,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "SeoScan_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "SeoScan_id_seq";

-- CreateIndex
CREATE INDEX "SeoScan_userId_idx" ON "SeoScan"("userId");

-- CreateIndex
CREATE INDEX "SeoScan_createdAt_idx" ON "SeoScan"("createdAt");

-- CreateIndex
CREATE INDEX "SeoScan_url_idx" ON "SeoScan"("url");
