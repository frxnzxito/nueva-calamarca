-- CreateTable
CREATE TABLE "public"."Rol" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Rol_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Usuario" (
    "id" SERIAL NOT NULL,
    "ci" TEXT NOT NULL,
    "apellidos" TEXT NOT NULL,
    "nombres" TEXT NOT NULL,
    "foto" TEXT,
    "rolId" INTEGER NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Turno" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Turno_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PuestoTrabajo" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "PuestoTrabajo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Asistencia" (
    "id" SERIAL NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "turnoId" INTEGER NOT NULL,
    "puestoTrabajoId" INTEGER NOT NULL,

    CONSTRAINT "Asistencia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Mina" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Mina_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Produccion" (
    "id" SERIAL NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "turnoId" INTEGER NOT NULL,
    "minaId" INTEGER NOT NULL,
    "perforistaId" INTEGER NOT NULL,
    "encargadoId" INTEGER NOT NULL,
    "carros" INTEGER NOT NULL,
    "sacos" INTEGER NOT NULL,
    "topesPerforados" INTEGER NOT NULL,

    CONSTRAINT "Produccion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Rol_nombre_key" ON "public"."Rol"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_ci_key" ON "public"."Usuario"("ci");

-- CreateIndex
CREATE UNIQUE INDEX "Turno_nombre_key" ON "public"."Turno"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "PuestoTrabajo_nombre_key" ON "public"."PuestoTrabajo"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Mina_nombre_key" ON "public"."Mina"("nombre");

-- AddForeignKey
ALTER TABLE "public"."Usuario" ADD CONSTRAINT "Usuario_rolId_fkey" FOREIGN KEY ("rolId") REFERENCES "public"."Rol"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Asistencia" ADD CONSTRAINT "Asistencia_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "public"."Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Asistencia" ADD CONSTRAINT "Asistencia_turnoId_fkey" FOREIGN KEY ("turnoId") REFERENCES "public"."Turno"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Asistencia" ADD CONSTRAINT "Asistencia_puestoTrabajoId_fkey" FOREIGN KEY ("puestoTrabajoId") REFERENCES "public"."PuestoTrabajo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Produccion" ADD CONSTRAINT "Produccion_turnoId_fkey" FOREIGN KEY ("turnoId") REFERENCES "public"."Turno"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Produccion" ADD CONSTRAINT "Produccion_minaId_fkey" FOREIGN KEY ("minaId") REFERENCES "public"."Mina"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Produccion" ADD CONSTRAINT "Produccion_perforistaId_fkey" FOREIGN KEY ("perforistaId") REFERENCES "public"."Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Produccion" ADD CONSTRAINT "Produccion_encargadoId_fkey" FOREIGN KEY ("encargadoId") REFERENCES "public"."Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
