import { PrismaService } from 'src/prisma/prisma.service';

async function clearDatabase(prisma: PrismaService) {
  await prisma.leagueInviteCode.deleteMany({});
  await prisma.leagueMember.deleteMany({});
  await prisma.league.deleteMany({});
  await prisma.season.deleteMany({});
  await prisma.password.deleteMany({});
  await prisma.user.deleteMany({});
}

export default clearDatabase;
