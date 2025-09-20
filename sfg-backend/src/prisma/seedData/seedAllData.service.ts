import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NodeEnv } from "src/config";
import { TableSeedService } from "./table-seed-data.service";
import { DevSeedService } from "./dev-seed-data.service";

@Injectable()
export class SeedAllDataService {
    private readonly logger = new Logger(SeedAllDataService.name);

    constructor(
        private readonly configService: ConfigService,
        private readonly tableSeedService: TableSeedService,
        private readonly devSeedService: DevSeedService
    ) { }

    async runSeed() {
        const shouldSeed = this.configService.getOrThrow<boolean>('seed_data');
        if (!shouldSeed) {
            this.logger.debug('Database seeding disabled');
            return;
        }

        this.logger.log('Database seeding enabled. Starting seed...');
        this.logger.log('Clearing existing data from all tables...');
        await this.tableSeedService.clearAllTables();
        this.logger.log('All tables cleared.');

        const node_env = this.configService.get<NodeEnv>('node_env');
        if (node_env === NodeEnv.Development) {
            this.logger.log('Seeding development data...');
            await this.devSeedService.seedDevData();
            this.logger.log('Development data seeding completed.');
        } else {
            this.logger.debug('Skipped seeding development data...');
        }
    }
}