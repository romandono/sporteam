-- Drop FK constraints on jugadores and entrenadores
ALTER TABLE "jugadores" DROP CONSTRAINT IF EXISTS "jugadores_user_id_fkey";
ALTER TABLE "entrenadores" DROP CONSTRAINT IF EXISTS "entrenadores_user_id_fkey";

-- Drop old tables
DROP TABLE "jugadores";
DROP TABLE "entrenadores";

-- Drop old FK column on estadisticas
ALTER TABLE "estadisticas" DROP COLUMN "jugador_id";