import { Injectable } from "@nestjs/common";
import { Season } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class SeasonService {
    constructor(private readonly prismaService: PrismaService) { }

    async getAllSeasons(): Promise<Season[]> {
        return await this.prismaService.season.findMany({
            orderBy: {
                startDate: 'desc',
            },
        });
    }
}