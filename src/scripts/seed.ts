import { PrismaClient } from '@prisma/client';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();
import * as dotenv from 'dotenv';
dotenv.config();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@default.com'
  const adminPassword = process.env.ADMIN_PASSWORD || 'changeme'
  const adminName = process.env.ADMIN_NAME || 'Super Admin';

  // gerar hash da senha
  const saltRounds = 10;
  const senhaHash = await bcrypt.hash(adminPassword, saltRounds);

  // verifica se já existe admin
  const existingAdmin = await prisma.user.findFirst({
    where: { role: 'ADMIN', email: adminEmail },
  });

  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        name: adminName,
        email: adminEmail,
        password: senhaHash,
        role: 'ADMIN',
      },
    });

    console.log('✅ Admin criado com sucesso!');
  } else {
    console.log('ℹ️ Admin já existe, seed ignorado.');
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
