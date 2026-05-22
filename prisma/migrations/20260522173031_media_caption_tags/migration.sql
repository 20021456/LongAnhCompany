-- AlterTable
ALTER TABLE "media" ADD COLUMN     "caption" TEXT,
ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[];
