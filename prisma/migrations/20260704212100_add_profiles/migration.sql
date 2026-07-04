-- CreateEnum
CREATE TYPE "ProfileType" AS ENUM ('JUGADOR', 'ENTRENADOR', 'PREPARADOR', 'MEDICO', 'DIRECTIVO', 'OJEADOR');

-- CreateTable: perfiles (Profile model)
CREATE TABLE "perfiles" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "profile_type" "ProfileType" NOT NULL,
    "nombre_deportivo" TEXT,
    "telefono" TEXT,
    "fecha_nacimiento" TIMESTAMP(3),
    "lateralidad" TEXT,
    "demarcacion" TEXT[],
    "altura" DECIMAL(5,2),
    "peso" DECIMAL(5,2),
    "entrenador_porteros" BOOLEAN NOT NULL DEFAULT false,
    "titulacion" TEXT[],
    "localidad_id" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "perfiles_pkey" PRIMARY KEY ("id")
);

-- Migrate data: jugadores → perfiles (profile_type = 'JUGADOR')
INSERT INTO "perfiles" ("id", "user_id", "profile_type", "nombre_deportivo", "fecha_nacimiento", "lateralidad", "demarcacion", "altura", "peso", "entrenador_porteros", "titulacion", "created_at", "updated_at")
SELECT gen_random_uuid()::TEXT, j."user_id", 'JUGADOR'::"ProfileType", j."nombre_deportivo", j."fecha_nacimiento", j."lateralidad", j."demarcacion", j."altura", j."peso", false, '{}', NOW(), NOW()
FROM "jugadores" j;

-- Migrate data: entrenadores → perfiles (profile_type = 'ENTRENADOR')
INSERT INTO "perfiles" ("id", "user_id", "profile_type", "nombre_deportivo", "telefono", "entrenador_porteros", "titulacion", "created_at", "updated_at")
SELECT gen_random_uuid()::TEXT, e."user_id", 'ENTRENADOR'::"ProfileType", e."nombre_deportivo", e."telefono", e."entrenador_porteros", e."titulacion", NOW(), NOW()
FROM "entrenadores" e;

-- Add profile_id column to estadisticas (nullable initially)
ALTER TABLE "estadisticas" ADD COLUMN "profile_id" TEXT;

-- Link existing estadisticas to their JUGADOR profiles
UPDATE "estadisticas" e
SET "profile_id" = p."id"
FROM "perfiles" p
WHERE p."user_id" = e."jugador_id" AND p."profile_type" = 'JUGADOR';

-- Make profile_id NOT NULL after data migration
ALTER TABLE "estadisticas" ALTER COLUMN "profile_id" SET NOT NULL;

-- Drop old unique constraint on (jugador_id, temporada_id)
DROP INDEX IF EXISTS "estadisticas_jugador_id_temporada_id_key";

-- Add new unique constraint on (profile_id, temporada_id)
CREATE UNIQUE INDEX "estadisticas_profile_id_temporada_id_key" ON "estadisticas"("profile_id", "temporada_id");

-- Drop old FK: estadisticas → users (jugador_id)
ALTER TABLE "estadisticas" DROP CONSTRAINT IF EXISTS "estadisticas_jugador_id_fkey";

-- Add new FK: estadisticas → perfiles (profile_id)
ALTER TABLE "estadisticas" ADD CONSTRAINT "estadisticas_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "perfiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Add FK: perfiles → users (user_id)
ALTER TABLE "perfiles" ADD CONSTRAINT "perfiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Add FK: perfiles → localidades (localidad_id)
ALTER TABLE "perfiles" ADD CONSTRAINT "perfiles_localidad_id_fkey" FOREIGN KEY ("localidad_id") REFERENCES "localidades"("id") ON DELETE SET NULL ON UPDATE CASCADE;