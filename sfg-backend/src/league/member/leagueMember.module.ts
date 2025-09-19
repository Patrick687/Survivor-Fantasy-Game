import { Module } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { LeagueMemberService } from "./leagueMember.service";
import { LeagueMemberResolver } from "./leagueMember.resolver";

@Module({
    imports: [],
    providers: [PrismaService, LeagueMemberService, LeagueMemberResolver],
    exports: [LeagueMemberService],
    controllers: [],
})
export class LeagueMemberModule { }