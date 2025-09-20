import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { Password, Profile, User, Prisma } from "@prisma/client";

@Injectable()
export class TableSeedService {
    constructor(private readonly prismaService: PrismaService) { }

    public async clearAllTables() {
        await this.prismaService.password.deleteMany({});
        await this.prismaService.profile.deleteMany({});
        await this.prismaService.user.deleteMany({});
    }

    public async createUserRecord(
        prisma: PrismaService | Prisma.TransactionClient,
        { userId, email }: { userId: User['userId'], email: User['email']; }
    ): Promise<User> {
        return await prisma.user.create({
            data: { userId, email }
        });
    }

    async createPasswordRecord(
        prisma: PrismaService | Prisma.TransactionClient,
        { userId, hash }: { userId: Password['userId'], hash: Password['hash']; }
    ) {
        const nextSeq = await prisma.password.count({
            where: { userId }
        }) + 1;

        return await prisma.password.create({
            data: { userId, hash, seq: nextSeq }
        });
    }

    async createProfileRecord(
        prisma: PrismaService | Prisma.TransactionClient,
        { userId, userName, firstName, lastName, isPublic = false }: Prisma.ProfileUncheckedCreateInput
    ) {
        return await prisma.profile.create({
            data: { userId, userName, firstName, lastName, isPublic }
        });
    }
}