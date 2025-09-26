import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Token, Prisma } from '@prisma/client';

@Injectable()
export class TokenRepository {
    constructor(private readonly prisma: PrismaService) { }

    async createToken(
        {
            userId,
            token,
            expiresAt,
        }: Omit<Prisma.TokenUncheckedCreateInput, 'seq'>,
        prismaClient: PrismaService | Prisma.TransactionClient = this.prisma,
    ): Promise<Token> {

        const nextSeq = await this.findLatestSeqForUser(userId, prismaClient) + 1;

        return await prismaClient.token.create({ data: { userId, token, expiresAt, seq: nextSeq } });
    }

    private async findLastestTokenForUser(
        userId: Token['userId'],
        prismaClient: PrismaService | Prisma.TransactionClient = this.prisma,
    ): Promise<Token | null> {
        return await prismaClient.token.findFirst({
            where: { userId },
            orderBy: { seq: 'desc' },
        });
    }

    private async findLatestSeqForUser(
        userId: Token['userId'],
        prismaClient: PrismaService | Prisma.TransactionClient = this.prisma,
    ): Promise<number> {
        const latest = await this.findLastestTokenForUser(userId, prismaClient);
        return latest?.seq ?? 0;
    }
}