import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { createUser, loginUser } from './helpers/authTestHelpers';
import { createLeague, getLeague, getUserLeagues } from './helpers/leagueTestHelpers';

describe('LeagueResolver (e2e)', () => {
    let app: INestApplication;
    let prismaService: PrismaService;
    let token: string;
    let createdLeagueId: string;

    const mockUser = {
        username: `testuser_${Date.now()}`,
        email: `testuser_${Date.now()}@example.com`,
        password: 'Password123!',
    };

    const mockSeason = {
        id: `season_${Date.now()}`,
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

        // Create league using helper
        const leagueRes = await createLeague(app, { name: 'Test League', seasonId: mockSeason.id, token });
        createdLeagueId = leagueRes.body.data.createLeague.id;
    });

    afterAll(async () => {
        // Clean up created league and season
        await prismaService.league.deleteMany({ where: { id: createdLeagueId } });
        await prismaService.season.deleteMany({ where: { id: mockSeason.id } });
        await prismaService.user.deleteMany({ where: { username: mockUser.username } });
        await app.close();
    });

    it('should fetch a league by id', async () => {
        const res = await getLeague(app, createdLeagueId, token);

        expect(res.body.data.getLeague).toBeDefined();
        expect(res.body.data.getLeague.id).toBe(createdLeagueId);
        expect(res.body.data.getLeague.name).toBe('Test League');
        expect(res.body.data.getLeague.seasonId).toBe(mockSeason.id);
    });

    it('should fetch user leagues', async () => {
        const res = await getUserLeagues(app, token);

        expect(res.body.data.getUserLeagues).toBeDefined();
        expect(Array.isArray(res.body.data.getUserLeagues)).toBe(true);

        const foundLeague = res.body.data.getUserLeagues.find((l: any) => l.id === createdLeagueId);
        expect(foundLeague).toBeDefined();
        expect(foundLeague.name).toBe('Test League');
        expect(foundLeague.seasonId).toBe(mockSeason.id);
    });

    it('should create a new league', async () => {
        const newLeagueName = `New League ${Date.now()}`;
        const leagueRes = await createLeague(app, { name: newLeagueName, seasonId: mockSeason.id, token });

        expect(leagueRes.body.data.createLeague).toBeDefined();
        expect(leagueRes.body.data.createLeague.name).toBe(newLeagueName);
        expect(leagueRes.body.data.createLeague.seasonId).toBe(mockSeason.id);

        // Clean up the created league
        await prismaService.league.delete({
            where: { id: leagueRes.body.data.createLeague.id }
        });
    });
});