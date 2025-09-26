import { Injectable } from "@nestjs/common";
import { Prisma, Profile } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class ProfileRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findProfile<K extends keyof Profile>(
        field: K,
        value: Profile[K],
        prismaClient: PrismaService | Prisma.TransactionClient = this.prisma
    ): Promise<Profile | null> {
        const profileRecord = await prismaClient.profile.findFirst({
            where: { [field]: value },
        });

        return profileRecord;
    }

    async createProfile({
        userName,
        firstName,
        lastName,
        isPublic = true,
        userId
    }: Prisma.ProfileUncheckedCreateInput,
        prismaClient: PrismaService | Prisma.TransactionClient = this.prisma
    ): Promise<Profile> {
        const profileRecord = await prismaClient.profile.create({
            data: {
                userName,
                firstName,
                lastName,
                isPublic,
                userId
            },
        });

        return profileRecord;
    }

    async findProfileByUnique(
        where: Prisma.ProfileWhereUniqueInput,
        prismaClient: PrismaService | Prisma.TransactionClient = this.prisma
    ): Promise<Profile | null> {
        return prismaClient.profile.findUnique({ where });
    }
}