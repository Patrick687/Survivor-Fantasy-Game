import { Injectable, NotFoundException, NotImplementedException } from "@nestjs/common";
import { League, LeagueMemberRole, User } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateLeagueDto } from "./dto/createLeague.dto";
import { LeagueMemberService } from "./member/leagueMember.service";
import { ForbiddenError } from "@nestjs/apollo";

@Injectable()
export class LeagueService {


    constructor(private readonly prismaService: PrismaService, private readonly leagueMemberService: LeagueMemberService) {

    }

    async getUserLeagues(userId: User['id']): Promise<League[]> {
        //Join leagues with league members to get only leagues where the user is a member
        const leaguesData = await this.prismaService.league.findMany({
            where: {
                LeagueMember: {
                    some: {
                        userId: userId,
                    },
                },
            },
            include: {
                LeagueMember: {
                    include: {
                        user: true,
                    },
                },
            },
        });

        return leaguesData;
    }

    async getLeagueById(leagueId: string, userId?: User['id']): Promise<League> {
        const leagueData = await this.prismaService.league.findUnique({
            where: { id: leagueId },
        });

        if (!leagueData) {
            throw new NotFoundException(`League with ID ${leagueId} not found`);
        }

        if (userId && !await this.leagueMemberService.isLeagueMember(leagueId, userId)) {
            throw new ForbiddenError(`User with ID ${userId} is not a member of league with ID ${leagueId}`);
        }

        return leagueData;
    }

    async createLeague(data: CreateLeagueDto, userId: string): Promise<League> {
        // const leagueData = await this.prismaService.league.create({
        //     data: {
        //         name: data.name,
        //         seasonId: data.seasonId,
        //     },
        // });

        // const leagueMemberData = await this.leagueMemberService.createLeagueOwner(userId, leagueData.id);
        // return leagueData;
        return this.prismaService.$transaction(async (tx) => {
            // Create the league
            const leagueData = await tx.league.create({
                data: {
                    name: data.name,
                    seasonId: data.seasonId,
                },
            });

            // Create the owner as a league member, passing the transaction client
            await this.leagueMemberService.createLeagueOwner(userId, leagueData.id, tx);

            return leagueData;
        });
    }
}