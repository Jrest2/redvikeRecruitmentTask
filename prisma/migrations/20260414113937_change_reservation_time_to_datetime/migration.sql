-- AlterTable
ALTER TABLE "reservation"
ALTER COLUMN "start_time" TYPE TIMESTAMP(3) USING "start_time"::timestamp(3),
ALTER COLUMN "end_time" TYPE TIMESTAMP(3) USING "end_time"::timestamp(3);
