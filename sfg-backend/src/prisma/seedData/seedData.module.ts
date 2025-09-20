import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma.module";
import { DevSeedService } from "./dev-seed-data.service";
import { SeedAllDataService } from "./seedAllData.service";
import { TableSeedService } from "./table-seed-data.service";
import { ConfigModule } from "@nestjs/config";

@Module({
    imports: [PrismaModule, ConfigModule],
    providers: [DevSeedService, SeedAllDataService, TableSeedService],
    exports: [SeedAllDataService]
})
export class SeedDataModule { }