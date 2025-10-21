import { PrismaService } from '../../../src/prisma/prisma.service';

export default async function cleanUpData(prisma: PrismaService) {
  // Delete in order to respect foreign key constraints
  // Children first, then parents

  // 1. Delete LeagueInviteToken (references League and User)
  await prisma.leagueInviteToken.deleteMany({});

  // 2. Delete LeagueMember (references League and User)
  await prisma.leagueMember.deleteMany({});

  // 3. Delete League (references Season and User as createdBy)
  await prisma.league.deleteMany({});

  // 4. Delete Season (no foreign key dependencies, but referenced by League)
  await prisma.season.deleteMany({});

  // 5. Delete Token (references User)
  await prisma.token.deleteMany({});

  // 6. Delete Password (references User)
  await prisma.password.deleteMany({});

  // 7. Delete Profile (references User)
  await prisma.profile.deleteMany({});

  // 8. Delete User last (referenced by many tables)
  await prisma.user.deleteMany({});
}
