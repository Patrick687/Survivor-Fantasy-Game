import { Module } from "@nestjs/common";
import { SeasonService } from "./season.service";
import { SeasonResolver } from "./season.resolver";
import { PrismaService } from "src/prisma/prisma.service";

@Module({
    imports: [],
    providers: [SeasonService, SeasonResolver, PrismaService],
    exports: [SeasonService]
})
export class SeasonModule { }