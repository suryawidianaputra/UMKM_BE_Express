/*
  Warnings:

  - You are about to drop the column `latitude` on the `Store` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `Store` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Store" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "storeName" TEXT NOT NULL,
    "storePicture" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "isDeleted" BOOLEAN DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Store_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Store" ("createdAt", "id", "isActive", "isDeleted", "storeName", "storePicture", "updatedAt", "userId") SELECT "createdAt", "id", "isActive", "isDeleted", "storeName", "storePicture", "updatedAt", "userId" FROM "Store";
DROP TABLE "Store";
ALTER TABLE "new_Store" RENAME TO "Store";
CREATE UNIQUE INDEX "Store_userId_key" ON "Store"("userId");
CREATE UNIQUE INDEX "Store_storeName_key" ON "Store"("storeName");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
