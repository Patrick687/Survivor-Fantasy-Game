import { Module } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { LeagueMemberModule } from "../member/leagueMember.module";

@Module({
    imports: [LeagueMemberModule],
    providers: [PrismaService],
    exports: []
}) export class LeagueInviteModule { }