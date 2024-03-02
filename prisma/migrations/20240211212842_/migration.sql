/*
  Warnings:

  - A unique constraint covering the columns `[userId,name]` on the table `From` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "From_userId_name_key" ON "From"("userId", "name");
