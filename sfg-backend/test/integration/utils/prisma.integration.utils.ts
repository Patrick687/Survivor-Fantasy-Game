import { PrismaService } from '../../../src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

export async function clearDatabase(prisma: PrismaService): Promise<void> {
  // Delete in correct order to avoid foreign key constraints
  await prisma.token.deleteMany({});
  await prisma.password.deleteMany({});
  await prisma.profile.deleteMany({});
  await prisma.user.deleteMany({});
}

export async function seedTestUser(
  prisma: PrismaService,
  userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    userName: string;
  },
): Promise<any> {
  // Hash the password properly
  const hashedPassword = await bcrypt.hash(userData.password, 10);

  // Create user with lowercase email (matching DTO transformation)
  const user = await prisma.user.create({
    data: {
      email: userData.email.toLowerCase(),
      role: 'USER',
    },
  });

  // Create profile with lowercase username (matching DTO transformation)
  const profile = await prisma.profile.create({
    data: {
      userId: user.userId,
      firstName: userData.firstName,
      lastName: userData.lastName,
      userName: userData.userName.toLowerCase(),
      isPublic: true,
    },
  });

  // Create password record
  await prisma.password.create({
    data: {
      userId: user.userId,
      hash: hashedPassword,
      seq: 1,
    },
  });

  return { user, profile };
}
