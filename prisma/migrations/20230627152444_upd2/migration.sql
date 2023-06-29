/*
  Warnings:

  - Added the required column `name` to the `Song` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Song" DROP CONSTRAINT "Song_post_id_fkey";

-- AlterTable
ALTER TABLE "Song" ADD COLUMN     "name" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Song" ADD CONSTRAINT "Song_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
