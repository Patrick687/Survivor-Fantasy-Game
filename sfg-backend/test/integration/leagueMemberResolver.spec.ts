import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { createUser, loginUser } from './helpers/authTestHelpers';
import { createLeague } from './helpers/leagueTestHelpers';
import { getLeagueMembers } from './helpers/leagueMemberHelper';

describe('LeagueMemberResolver (e2e)', () => {
    let app: INestApplication;
    let prismaService: PrismaService;
    let token: string;
    let createdLeagueId: string;
    let createdUserId: string;

    const mockUser = {
        username: `testuser_${Date.now()}_${Math.floor(Math.random() * 1000000)}`,
        email: `testuser_${Date.now()}_${Math.floor(Math.random() * 1000000)}@example.com`,
        password: 'Password123!',
    };

    const mockSeason = {
        id: `test-48-${Date.now()}-${Math.floor(Math.random() * 1000000)}`,
        name: 'Survivor 48: Fiji',
        startDate: new Date('2025-02-28'),
        endDate: new Date('2025-05-22'),
        createdAt: new Date(),
        updatedAt: new Date()
    };

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        prismaService = app.get(PrismaService);

        // Create season
        await prismaService.season.create({ data: mockSeason });

        // Create user and login to get token
        await createUser(app, mockUser);
        const loginRes = await loginUser(app, { usernameOrEmail: mockUser.username, password: mockUser.password });
        token = loginRes.body.data.login.token;

        // Get userId from login response or fetch from DB
        const userRecord = await prismaService.user.findUnique({ where: { username: mockUser.username } });
        createdUserId = userRecord?.id ?? '';

        // Create league using helper
        const leagueRes = await createLeague(app, { name: 'Test League', seasonId: mockSeason.id, token });
        createdLeagueId = leagueRes.body.data.createLeague.id;

        // Add user as league owner (direct Prisma for simplicity)
        await prismaService.leagueMember.create({
            data: {
                userId: createdUserId,
                leagueId: createdLeagueId,
                role: 'OWNER',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        });
    });

    afterAll(async () => {
        await prismaService.leagueMember.deleteMany({ where: { leagueId: createdLeagueId } });
        await prismaService.league.deleteMany({ where: { id: createdLeagueId } });
        await prismaService.season.deleteMany({ where: { id: mockSeason.id } });
        await prismaService.password.deleteMany({ where: { userId: createdUserId } });
        await prismaService.user.deleteMany({ where: { id: createdUserId } });
        await app.close();
    });

    it('should resolve user and league for leagueMember', async () => {
        const res = await getLeagueMembers(app, createdLeagueId, token);

        expect(res.body.data.getLeague).toBeDefined();
        const foundMember = res.body.data.getLeague.leagueMembers.find((m: any) => m.user.id === createdUserId);
        expect(foundMember).toBeDefined();
        expect(foundMember.user.id).toBe(createdUserId);
        expect(foundMember.league.id).toBe(createdLeagueId);
        expect(foundMember.role).toBe('OWNER');
    });
});