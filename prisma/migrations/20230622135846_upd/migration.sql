/*
  Warnings:

  - You are about to drop the `Artist` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_artist_id_fkey";

-- DropTable
DROP TABLE "Artist";

-- CreateTable
CREATE TABLE "Artists" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Artists_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "Artists"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
