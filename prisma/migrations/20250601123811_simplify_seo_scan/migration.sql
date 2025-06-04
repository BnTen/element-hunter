/*
  Warnings:

  - You are about to drop the column `h1` on the `SeoScan` table. All the data in the column will be lost.
  - You are about to drop the column `h2` on the `SeoScan` table. All the data in the column will be lost.
  - You are about to drop the column `h3` on the `SeoScan` table. All the data in the column will be lost.
  - You are about to drop the column `images` on the `SeoScan` table. All the data in the column will be lost.
  - You are about to drop the column `links` on the `SeoScan` table. All the data in the column will be lost.
  - You are about to drop the column `manifest` on the `SeoScan` table. All the data in the column will be lost.
  - You are about to drop the column `metaDescription` on the `SeoScan` table. All the data in the column will be lost.
  - You are about to drop the column `metaTags` on the `SeoScan` table. All the data in the column will be lost.
  - You are about to drop the column `rawData` on the `SeoScan` table. All the data in the column will be lost.
  - You are about to drop the column `scripts` on the `SeoScan` table. All the data in the column will be lost.
  - You are about to drop the column `styles` on the `SeoScan` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `SeoScan` table. All the data in the column will be lost.
  - Added the required column `data` to the `SeoScan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SeoScan" DROP COLUMN "h1",
DROP COLUMN "h2",
DROP COLUMN "h3",
DROP COLUMN "images",
DROP COLUMN "links",
DROP COLUMN "manifest",
DROP COLUMN "metaDescription",
DROP COLUMN "metaTags",
DROP COLUMN "rawData",
DROP COLUMN "scripts",
DROP COLUMN "styles",
DROP COLUMN "title",
ADD COLUMN     "data" JSONB NOT NULL;
