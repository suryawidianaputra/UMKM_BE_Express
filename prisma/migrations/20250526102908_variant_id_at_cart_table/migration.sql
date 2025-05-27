/*
  Warnings:

  - Added the required column `variantId` to the `Cart` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Cart" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "productId" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Cart_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Cart_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Cart_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Cart" ("createdAt", "id", "productId", "quantity", "updatedAt", "userId") SELECT "createdAt", "id", "productId", "quantity", "updatedAt", "userId" FROM "Cart";
DROP TABLE "Cart";
ALTER TABLE "new_Cart" RENAME TO "Cart";
CREATE UNIQUE INDEX "Cart_productId_userId_key" ON "Cart"("productId", "userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
