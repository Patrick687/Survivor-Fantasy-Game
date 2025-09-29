import { PrismaService } from '../../../../src/prisma/prisma.service';

export const cleanupTestUser = async (
  prismaService: PrismaService,
  email: string,
): Promise<void> => {
  const existingUser = await prismaService.user.findUnique({
    where: { email: email.toLowerCase() },
  });
  if (existingUser) {
    await prismaService.user.delete({ where: { email } });
  }
};
