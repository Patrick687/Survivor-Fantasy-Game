import { Module } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { LeagueService } from "./league.service";
import { LeagueResolver } from "./league.resolver";
import { LeagueMemberModule } from "./member/leagueMember.module";
import { TokenService } from "src/auth/token/token.service";

@Module({
    imports: [LeagueMemberModule],
    providers: [PrismaService, LeagueService, LeagueResolver, TokenService],
    exports: [LeagueService],
})
export class LeagueModule { }