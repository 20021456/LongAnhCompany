-- AlterTable
ALTER TABLE "articles" ADD COLUMN     "commentCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "jobs" ADD COLUMN     "deadlineText" TEXT,
ADD COLUMN     "levelEn" TEXT,
ADD COLUMN     "levelVi" TEXT,
ADD COLUMN     "levelZh" TEXT,
ADD COLUMN     "salaryTextEn" TEXT,
ADD COLUMN     "salaryTextVi" TEXT,
ADD COLUMN     "salaryTextZh" TEXT,
ADD COLUMN     "tags" JSONB,
ADD COLUMN     "typeEn" TEXT,
ADD COLUMN     "typeVi" TEXT,
ADD COLUMN     "typeZh" TEXT;

-- AlterTable
ALTER TABLE "product_specs" ADD COLUMN     "specKey" TEXT,
ADD COLUMN     "unitText" TEXT;

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "features" JSONB,
ADD COLUMN     "moqEn" TEXT,
ADD COLUMN     "moqZh" TEXT,
ADD COLUMN     "productionTimeEn" TEXT,
ADD COLUMN     "productionTimeZh" TEXT,
ADD COLUMN     "summaryEn" TEXT,
ADD COLUMN     "summaryVi" TEXT,
ADD COLUMN     "summaryZh" TEXT,
ADD COLUMN     "tags" JSONB,
ADD COLUMN     "unitEn" TEXT,
ADD COLUMN     "unitVi" TEXT,
ADD COLUMN     "unitZh" TEXT;
