import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { createUser, loginUser } from './helpers/authTestHelpers';
import { PrismaService } from 'src/prisma/prisma.service';
import { PasswordService } from 'src/auth/password/password.service';

describe('AuthResolver (e2e)', () => {
    let app: INestApplication;
    let prismaService: PrismaService;
    let passwordService: PasswordService;

    const mockUser = {
        username: `testuser_${Date.now()}`,
        email: `test_${Date.now()}@example.com`,
        password: 'Password123!'
    };

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        prismaService = await app.get(PrismaService);
        passwordService = await app.get(PasswordService);
    });

    afterAll(async () => {
        await app.close();
    });

    afterEach(async () => {
        // Clean up test user after each test
        prismaService.user.deleteMany({
            where: { username: mockUser.username }
        });
    });

    it('should signup a new user', async () => {
        const res = await createUser(app, mockUser);

        expect(res.body.data.register.user.username).toBe(mockUser.username);
        expect(res.body.data.register.token).toBeDefined();
    });

    it('should store user password securely', async () => {
        const res = await createUser(app, mockUser);
        await prismaService.user.findFirst({
            where: { username: mockUser.username },
            include: { password: true }
        }).then(userWithPassword => {
            expect(userWithPassword).toBeDefined();
            expect(userWithPassword?.password).toBeDefined();

        });
    });

    it('should login an existing user with username', async () => {
        await createUser(app, mockUser);
        const res = await loginUser(app, { usernameOrEmail: mockUser.username, password: mockUser.password });

        expect(res.body.data.login.user.username).toBe(mockUser.username);
        expect(res.body.data.login.token).toBeDefined();
    });

    it('should login an existing user with email', async () => {
        await createUser(app, mockUser);
        const res = await loginUser(app, { usernameOrEmail: mockUser.email, password: mockUser.password });

        expect(res.body.data.login.user.email).toBe(mockUser.email);
        expect(res.body.data.login.token).toBeDefined();
    });

    describe('Error cases', () => {
        it('should fail login with wrong username', async () => {
            await createUser(app, mockUser);
            const res = await loginUser(app, { usernameOrEmail: 'wronguser', password: mockUser.password });

            expect(res.body.data.login).toBeNull();
            expect(res.body.errors[0].message).toMatch(/Invalid credentials/i);
        });

        it('should fail login with wrong email', async () => {
            await createUser(app, mockUser);
            const res = await loginUser(app, { usernameOrEmail: 'wrongemail@example.com', password: mockUser.password });

            expect(res.body.data.login).toBeNull();
            expect(res.body.errors[0].message).toMatch(/Invalid credentials/i);
        });

        it('should fail login with wrong password using username', async () => {
            await createUser(app, mockUser);
            const res = await loginUser(app, { usernameOrEmail: mockUser.username, password: 'WrongPassword!' });

            expect(res.body.data.login).toBeNull();
            expect(res.body.errors[0].message).toMatch(/Invalid credentials/i);
        });

        it('should fail login with wrong password using email', async () => {
            await createUser(app, mockUser);
            const res = await loginUser(app, { usernameOrEmail: mockUser.email, password: 'WrongPassword!' });


            expect(res.body.data.login).toBeNull();
            expect(res.body.errors[0].message).toMatch(/Invalid credentials/i);
        });

        it('should not allow creating two users with the same username', async () => {
            await createUser(app, mockUser);
            const res = await createUser(app, {
                username: mockUser.username,
                email: `unique_${Date.now()}@example.com`,
                password: mockUser.password
            });

            expect(res.body.data.register).toBeNull();
            expect(res.body.errors[0].message).toMatch(/Username already taken/i);
        });

        it('should not allow creating two users with the same email', async () => {
            await createUser(app, mockUser);
            const res = await createUser(app, {
                username: `uniqueuser_${Date.now()}`,
                email: mockUser.email,
                password: mockUser.password
            });

            expect(res.body.data.register).toBeNull();
            expect(res.body.errors[0].message).toMatch(/Email already taken/i);
        });
    });

});