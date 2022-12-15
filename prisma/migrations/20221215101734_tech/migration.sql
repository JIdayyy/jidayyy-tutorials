-- CreateTable
CREATE TABLE "Technology" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT NOT NULL,

    CONSTRAINT "Technology_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PostToTechnology" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_PostToTechnology_AB_unique" ON "_PostToTechnology"("A", "B");

-- CreateIndex
CREATE INDEX "_PostToTechnology_B_index" ON "_PostToTechnology"("B");

-- AddForeignKey
ALTER TABLE "_PostToTechnology" ADD CONSTRAINT "_PostToTechnology_A_fkey" FOREIGN KEY ("A") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PostToTechnology" ADD CONSTRAINT "_PostToTechnology_B_fkey" FOREIGN KEY ("B") REFERENCES "Technology"("id") ON DELETE CASCADE ON UPDATE CASCADE;
