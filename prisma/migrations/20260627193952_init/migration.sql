-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN_ROLE', 'USER_ROLE', 'JUGADOR_ROLE', 'ENTRENADOR_ROLE', 'CLUB_ROLE');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellidos" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "estado" BOOLEAN NOT NULL DEFAULT true,
    "image" TEXT,
    "google" BOOLEAN NOT NULL DEFAULT false,
    "estado_deportivo" TEXT,
    "club_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jugadores" (
    "user_id" TEXT NOT NULL,
    "nombre_deportivo" TEXT,
    "fecha_nacimiento" TIMESTAMP(3),
    "lateralidad" TEXT,
    "demarcacion" TEXT[],
    "altura" DECIMAL(5,2),
    "peso" DECIMAL(5,2),

    CONSTRAINT "jugadores_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "entrenadores" (
    "user_id" TEXT NOT NULL,
    "nombre_deportivo" TEXT,
    "entrenador_porteros" BOOLEAN NOT NULL DEFAULT false,
    "titulacion" TEXT[],
    "telefono" TEXT,

    CONSTRAINT "entrenadores_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "clubs" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "localidad" TEXT,
    "provincia_id" TEXT,
    "modalidad" TEXT,
    "image" TEXT,
    "zona_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clubs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "estadisticas" (
    "id" TEXT NOT NULL,
    "jugador_id" TEXT NOT NULL,
    "temporada_id" TEXT NOT NULL,
    "partidos_jugados" INTEGER NOT NULL DEFAULT 0,
    "goles" INTEGER NOT NULL DEFAULT 0,
    "asistencias" INTEGER NOT NULL DEFAULT 0,
    "tarjetas_amarillas" INTEGER NOT NULL DEFAULT 0,
    "tarjetas_rojas" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "estadisticas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "temporadas" (
    "id" TEXT NOT NULL,
    "anho" TEXT NOT NULL,

    CONSTRAINT "temporadas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "provincias" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "provincias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zonas" (
    "id" TEXT NOT NULL,
    "nombre_zona" TEXT NOT NULL,

    CONSTRAINT "zonas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "localidades" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "localidades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_zonas" (
    "user_id" TEXT NOT NULL,
    "zona_id" TEXT NOT NULL,

    CONSTRAINT "user_zonas_pkey" PRIMARY KEY ("user_id","zona_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "estadisticas_jugador_id_temporada_id_key" ON "estadisticas"("jugador_id", "temporada_id");

-- CreateIndex
CREATE UNIQUE INDEX "temporadas_anho_key" ON "temporadas"("anho");

-- CreateIndex
CREATE UNIQUE INDEX "provincias_nombre_key" ON "provincias"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "zonas_nombre_zona_key" ON "zonas"("nombre_zona");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_club_id_fkey" FOREIGN KEY ("club_id") REFERENCES "clubs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jugadores" ADD CONSTRAINT "jugadores_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entrenadores" ADD CONSTRAINT "entrenadores_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clubs" ADD CONSTRAINT "clubs_provincia_id_fkey" FOREIGN KEY ("provincia_id") REFERENCES "provincias"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clubs" ADD CONSTRAINT "clubs_zona_id_fkey" FOREIGN KEY ("zona_id") REFERENCES "zonas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "estadisticas" ADD CONSTRAINT "estadisticas_jugador_id_fkey" FOREIGN KEY ("jugador_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "estadisticas" ADD CONSTRAINT "estadisticas_temporada_id_fkey" FOREIGN KEY ("temporada_id") REFERENCES "temporadas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_zonas" ADD CONSTRAINT "user_zonas_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_zonas" ADD CONSTRAINT "user_zonas_zona_id_fkey" FOREIGN KEY ("zona_id") REFERENCES "zonas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
