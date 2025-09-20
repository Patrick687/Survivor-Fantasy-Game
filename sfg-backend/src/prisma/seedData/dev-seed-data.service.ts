import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { User, Profile, Password } from "@prisma/client";
import { TableSeedService } from "./table-seed-data.service";

@Injectable()
export class DevSeedService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly tableSeedService: TableSeedService
    ) { }

    async seedDevData() {
        await this.seedDevUser(
            { userId: 'devuser1', email: 'devuser1@example.com' },
            { firstName: 'Alice', lastName: 'Anderson', isPublic: true, userName: 'alicea' },
            { hash: 'hashedpassword1' }
        );

        await this.seedDevUser(
            { userId: 'devuser2', email: 'devuser2@example.com' },
            { firstName: 'Bob', lastName: 'Brown', isPublic: false, userName: 'bobb' },
            { hash: 'hashedpassword2' }
        );

        await this.seedDevUser(
            { userId: 'devuser3', email: 'devuser3@example.com' },
            { firstName: 'Charlie', lastName: 'Clark', isPublic: true, userName: 'charliec' },
            { hash: 'hashedpassword3' }
        );
    }


    async seedDevUser(
        userArgs: { userId: string; email: string; },
        profileArgs?: { firstName: string; lastName?: string; isPublic?: boolean; userName: Profile['userName']; },
        passwordArgs?: { hash: string; }
    ): Promise<{ user: User; profile?: Profile; password?: Password; }> {
        return this.prismaService.$transaction(async (tx) => {
            const user = await this.tableSeedService.createUserRecord(tx, userArgs);

            let profile: Profile | undefined;
            if (profileArgs) {
                profile = await this.tableSeedService.createProfileRecord(tx, {
                    userId: user.userId,
                    firstName: profileArgs.firstName,
                    lastName: profileArgs.lastName,
                    isPublic: profileArgs.isPublic,
                    userName: profileArgs.userName,
                });
            }

            let password: Password | undefined;
            if (passwordArgs) {
                password = await this.tableSeedService.createPasswordRecord(tx, {
                    userId: user.userId,
                    hash: passwordArgs.hash,
                });
            }

            return { user, profile, password };
        });
    }
}