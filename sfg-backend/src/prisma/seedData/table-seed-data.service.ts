import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Password, Profile, User, Prisma } from '@prisma/client';

@Injectable()
export class TableSeedService {
  private readonly logger: Logger = new Logger(TableSeedService.name);
  constructor(private readonly prismaService: PrismaService) {}

  public async clearAllTables() {
    // Delete in correct order: child tables first, then parent tables
    this.logger.log('⚠️ Clearing existing data from all tables... ⚠️');
    // 1. Clear junction/relationship tables first
    await this.prismaService.seasonSurvivor.deleteMany({});
    await this.prismaService.leagueMember.deleteMany({});
    await this.prismaService.leagueInviteToken.deleteMany({});

    // 2. Clear tables that reference other tables
    await this.prismaService.league.deleteMany({});
    await this.prismaService.survivor.deleteMany({});
    await this.prismaService.season.deleteMany({});

    // 3. Clear user-related tables (Password and Profile reference User)
    await this.prismaService.password.deleteMany({});
    await this.prismaService.profile.deleteMany({});
    await this.prismaService.token.deleteMany({});

    // 4. Clear user table last (since it's referenced by many tables)
    await this.prismaService.user.deleteMany({});

    this.logger.log('✅ All tables cleared. ✅');
  }

  public async createUserRecord(
    prisma: PrismaService | Prisma.TransactionClient,
    { userId, email }: { userId: User['userId']; email: User['email'] },
  ): Promise<User> {
    return await prisma.user.create({
      data: { userId, email },
    });
  }

  async createPasswordRecord(
    prisma: PrismaService | Prisma.TransactionClient,
    { userId, hash }: { userId: Password['userId']; hash: Password['hash'] },
  ) {
    const nextSeq =
      (await prisma.password.count({
        where: { userId },
      })) + 1;

    return await prisma.password.create({
      data: { userId, hash, seq: nextSeq },
    });
  }

  async createProfileRecord(
    prisma: PrismaService | Prisma.TransactionClient,
    {
      userId,
      userName,
      firstName,
      lastName,
      isPublic = false,
    }: Prisma.ProfileUncheckedCreateInput,
  ) {
    return await prisma.profile.create({
      data: { userId, userName, firstName, lastName, isPublic },
    });
  }
}
