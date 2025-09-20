import { Injectable, NotFoundException } from "@nestjs/common";
import { User } from "./user.entity";
import { PrismaService } from "src/prisma/prisma.service";
import { UserRepository } from "./user.repository";
import { Prisma } from "@prisma/client";

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService,
        private readonly userRepository: UserRepository
    ) { }

    async getUser<K extends keyof User>(field: K, value: User[K]): Promise<User> {
        const userRecord = await this.userRepository.findUser(field, value);

        if (!userRecord) {
            throw new NotFoundException(`User with ${field}=${value} not found`);
        }

        return userRecord;
    }

    async createUser({ email }: Prisma.UserCreateInput, passwordData: Prisma.PasswordCreateInput, profileData: Prisma.ProfileCreateInput): Promise<User> {
        await this.prisma.$transaction(async (tx) => {
            await this.userRepository.createUser({ email }, tx);
        });

        return await this.getUser('email', email);
    }



}