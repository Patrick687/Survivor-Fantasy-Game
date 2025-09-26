import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { UserService } from "./user.service";
import { UserRepository } from "./user.repository";
import { ProfileModule } from "./profile/profile.module";
import { PasswordModule } from "./password/password.module";

@Module({
    imports: [PrismaModule, ProfileModule, PasswordModule],
    providers: [UserService, UserRepository],
    exports: [UserService]
})
export class UserModule { }