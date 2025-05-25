/*
  Warnings:

  - Added the required column `productVariantName` to the `ProductVariant` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ProductVariant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT NOT NULL,
    "productVariantName" TEXT NOT NULL,
    "productPrice" INTEGER NOT NULL,
    "productStock" INTEGER NOT NULL,
    "productSoldout" INTEGER NOT NULL DEFAULT 0,
    "isDeleted" BOOLEAN DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ProductVariant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ProductVariant" ("createdAt", "id", "isDeleted", "productId", "productPrice", "productSoldout", "productStock", "updatedAt") SELECT "createdAt", "id", "isDeleted", "productId", "productPrice", "productSoldout", "productStock", "updatedAt" FROM "ProductVariant";
DROP TABLE "ProductVariant";
ALTER TABLE "new_ProductVariant" RENAME TO "ProductVariant";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
