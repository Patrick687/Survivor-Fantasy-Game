import { Injectable, InternalServerErrorException } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PasswordService {
    private readonly saltRounds = 10;

    constructor(private readonly prisma: PrismaService) { }

    private async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, this.saltRounds);
    }

    private async comparePassword(password: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(password, hash);
    }

    async createPasswordForUser(userId: string, password: string): Promise<string> {
        const passwordHash = await this.hashPassword(password);
        await this.prisma.password.create({
            data: {
                userId,
                passwordHash,
            },
        });
        return passwordHash; // Return the hash for further use
    }

    async checkUserPassword(userId: string, password: string): Promise<boolean> {
        const userPassword = await this.prisma.password.findUnique({
            where: { userId },
        });

        if (!userPassword) {
            throw new InternalServerErrorException(`No password found for user with ID: ${userId}`);
        }

        return await this.comparePassword(password, userPassword.passwordHash);
    }
}