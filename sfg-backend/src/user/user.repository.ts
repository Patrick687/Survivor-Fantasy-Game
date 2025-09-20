import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma, User } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class UserRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findUser<K extends keyof User>(field: K, value: User[K], prismaClient: PrismaService | Prisma.TransactionClient = this.prisma): Promise<User | null> {
        const userRecord = await prismaClient.user.findFirst({
            where: { [field]: value },
        });

        return userRecord;
    }

    async createUser({ email }: Prisma.UserCreateInput, prismaClient: PrismaService | Prisma.TransactionClient = this.prisma): Promise<User> {
        return prismaClient.user.create({
            data: { email },
        });
    }

}