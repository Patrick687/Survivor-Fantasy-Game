import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { PasswordService } from "./password.service";
import { PasswordRepository } from "./password.repository";

@Module({
    imports: [PrismaModule],
    providers: [PasswordService, PasswordRepository],
    exports: [PasswordService],
})
export class PasswordModule { }