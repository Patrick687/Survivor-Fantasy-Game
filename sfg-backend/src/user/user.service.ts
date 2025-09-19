import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { User } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { RegisterDto } from "src/auth/dto/register.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class UserService {

    constructor(private readonly prisma: PrismaService) { }

    async createUser(registerDto: RegisterDto): Promise<User> {
        const { username, password, email } = registerDto;

        const existingByUsername = await this.prisma.user.findUnique({ where: { username } });
        if (existingByUsername) {
            throw new ConflictException('Username already taken');
        }

        // Check for existing email
        const existingByEmail = await this.prisma.user.findUnique({ where: { email } });
        if (existingByEmail) {
            throw new ConflictException('Email already taken');
        }

        const user = await this.prisma.user.create({
            data: {
                username,
                email,
            },
        });
        return user;
    }

    async getUser(field: 'id' | 'username' | 'email', value: string): Promise<User> {
        let user: User | null = null;
        if (field === 'id') {
            user = await this.prisma.user.findUnique({ where: { id: value } });
        } else if (field === 'username') {
            user = await this.prisma.user.findUnique({ where: { username: value } });
        } else if (field === 'email') {
            user = await this.prisma.user.findUnique({ where: { email: value } });
        } else {
            throw new InternalServerErrorException(`Invalid field: ${field}`);
        }

        if (!user) {
            throw new NotFoundException(`User not found with ${field}: ${value}`);
        }
        return user;
    }

}