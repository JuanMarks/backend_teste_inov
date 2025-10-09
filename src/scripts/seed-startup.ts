import { PrismaClient, StageStartup } from "@prisma/client";
import startups from "./startup.json";

const prisma = new PrismaClient();

async function main() {
  let criados = 0;
  let ignorados = 0;

  for (const startup of startups) {
    const existente = await prisma.startup.findUnique({
      where: { cnpj: startup.cnpj },
    });

    if (existente) {
      ignorados++;
    } else {
      await prisma.startup.create({
        data: {
          ...startup,
          stage: startup.stage.toUpperCase() as StageStartup,
        },
      });
      criados++;
    }
  }

  console.log(
    `🌱 Seed concluído! ${criados} startups criadas, ${ignorados} ignoradas.`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
