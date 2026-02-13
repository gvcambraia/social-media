-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "original_post_id" INTEGER;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_original_post_id_fkey" FOREIGN KEY ("original_post_id") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
