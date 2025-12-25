import { PrismaService } from 'src/prisma/prisma.service';

async function clearDatabase(prisma: PrismaService) {
  await prisma.password.deleteMany({});
  await prisma.user.deleteMany({});
}

export default clearDatabase;
