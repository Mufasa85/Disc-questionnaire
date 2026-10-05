-- CreateTable
CREATE TABLE "submissions" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nom" TEXT NOT NULL,
    "post_nom" TEXT,
    "prenom" TEXT,
    "sexe" TEXT,
    "date_naissance" DATE,
    "telephone" TEXT,
    "email" TEXT,
    "dominant_profile" VARCHAR(2) NOT NULL,
    "code" VARCHAR(2) NOT NULL,
    "answers" JSONB NOT NULL,
    "scores" JSONB NOT NULL,
    "duration_seconds" INTEGER,
    "ip" TEXT,
    "user_agent" TEXT,

    CONSTRAINT "submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admins" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_login_at" TIMESTAMP(3),

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "submissions_created_at_idx" ON "submissions"("created_at");

-- CreateIndex
CREATE INDEX "submissions_dominant_profile_idx" ON "submissions"("dominant_profile");

-- CreateIndex
CREATE INDEX "submissions_nom_idx" ON "submissions"("nom");

-- CreateIndex
CREATE UNIQUE INDEX "admins_email_key" ON "admins"("email");

