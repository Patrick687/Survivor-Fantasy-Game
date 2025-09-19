import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import request from 'supertest';
import { PrismaService } from 'src/prisma/prisma.service';

describe('SeasonResolver (e2e)', () => {
    let app: INestApplication;
    let prismaService: PrismaService;

    // Mock season data
    const mockSeason = {
        id: `season_1`,
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

        // Insert mock season
        await prismaService.season.create({
            data: {
                id: mockSeason.id,
                name: mockSeason.name,
                startDate: mockSeason.startDate,
                endDate: mockSeason.endDate,
                createdAt: mockSeason.createdAt,
                updatedAt: mockSeason.updatedAt
            }
        });
    });

    afterAll(async () => {
        // Clean up mock season
        await prismaService.season.deleteMany({
            where: { id: mockSeason.id }
        });
        await app.close();
    });

    it('should fetch all seasons', async () => {
        const query = `
            query {
                getAllSeasons {
                    id
                    name
                    startDate
                    endDate
                }
            }
        `;

        const res = await request(app.getHttpServer())
            .post('/graphql')
            .send({ query });

        expect(res.body.data.getAllSeasons).toBeDefined();
        expect(Array.isArray(res.body.data.getAllSeasons)).toBe(true);

        const foundSeason = res.body.data.getAllSeasons.find((s: any) => s.id === mockSeason.id);
        expect(foundSeason).toBeDefined();
        expect(foundSeason.name).toBe(mockSeason.name);
        expect(foundSeason.startDate).toBe(mockSeason.startDate.toISOString());
        expect(foundSeason.endDate).toBe(mockSeason.endDate.toISOString());
    });
});