-- CreateTable
CREATE TABLE "ads" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "price" DECIMAL(10,2),
    "image_url" TEXT,
    "city" TEXT,
    "district" TEXT,
    "category" TEXT,
    "condition" TEXT,
    "is_active" BOOLEAN DEFAULT true,
    "telegram_user_id" BIGINT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ads_pkey" PRIMARY KEY ("id")
);
