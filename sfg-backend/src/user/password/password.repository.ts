import { Injectable } from "@nestjs/common";
import { Password, Prisma } from "@prisma/client";
import { PrismaClient } from "@prisma/client/extension";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class PasswordRepository {
    constructor(private readonly prisma: PrismaService) { }


    async getCurrentPassword(
        userId: Password['userId'],
        prismaClient: PrismaService | Prisma.TransactionClient = this.prisma
    ): Promise<Password | null> {
        const passwordRecord = await prismaClient.password.findFirst({
            where: {
                userId
            },
            orderBy: {
                seq: 'desc'
            }
        });

        return passwordRecord;
    }

    async createPassword({
        userId,
        hash,
    }: Omit<Prisma.PasswordUncheckedCreateInput, 'seq'>,
        prismaClient: PrismaService | Prisma.TransactionClient = this.prisma
    ) {
        const passwordCount = await prismaClient.password.count({
            where: {
                userId
            }
        });

        const passwordRecord = await prismaClient.password.create({
            data: {
                userId,
                hash,
                seq: passwordCount + 1
            }
        });

        return passwordRecord;
    }
}