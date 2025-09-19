import { ConflictException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { LeagueMember, LeagueMemberRole, Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";



@Injectable()
export class LeagueMemberService {
    constructor(private readonly prismaService: PrismaService) { }

    async createLeagueOwner(userId: string, leagueId: string, prismaClient: PrismaService | Prisma.TransactionClient = this.prismaService): Promise<LeagueMember> {
        const existingOwner = await prismaClient.leagueMember.findFirst({
            where: { leagueId, role: LeagueMemberRole.OWNER },
        });

        if (existingOwner) {
            throw new InternalServerErrorException(`League with ID ${leagueId} already has an owner.`);
        }

        return this.createLeagueMember(userId, leagueId, LeagueMemberRole.OWNER, prismaClient);
    }

    async createLeagueMember(userId: string, leagueId: string, role: LeagueMemberRole, prismaClient: PrismaService | Prisma.TransactionClient = this.prismaService): Promise<LeagueMember> {
        const existingMember = await prismaClient.leagueMember.findFirst({
            where: { userId, leagueId },
        });

        if (existingMember) {
            throw new ConflictException(`User with ID ${userId} is already a member of league with ID ${leagueId}.`);
        }

        return prismaClient.leagueMember.create({
            data: {
                userId: userId,
                leagueId: leagueId,
                role: role,
            },
        });
    }

    async getLeagueAdminsByLeagueId(leagueId: string): Promise<LeagueMember[]> {
        const leagueAdmins = await this.prismaService.leagueMember.findMany({
            where: { leagueId, role: LeagueMemberRole.ADMIN },
            include: {
                user: true,
            },
        });

        return leagueAdmins;
    }

    async getLeagueOwnerByLeagueId(leagueId: string): Promise<LeagueMember> {
        const leagueOwner = await this.prismaService.leagueMember.findFirst({
            where: { leagueId, role: LeagueMemberRole.OWNER },
            include: {
                user: true,
            },
        });

        if (!leagueOwner) {
            throw new InternalServerErrorException(`No owner found for league with ID ${leagueId}`);
        }

        return leagueOwner;
    }

    async getLeagueMembersByLeagueId(leagueId: string): Promise<LeagueMember[]> {
        const leagueMembersInLeagueData = await this.prismaService.leagueMember.findMany({
            where: { leagueId },
            include: {
                user: true,
            },
        });

        if (leagueMembersInLeagueData.length === 0) {
            throw new InternalServerErrorException(`No league members found for league with ID ${leagueId}`);
        }

        return leagueMembersInLeagueData;
    }

    async getLeagueParticipantsByLeagueId(leagueId: string): Promise<LeagueMember[]> {
        const leagueMembers = await this.prismaService.leagueMember.findMany({
            where: { leagueId },
            include: {
                user: true,
            },
        });

        if (leagueMembers.length === 0) {
            throw new InternalServerErrorException(`No participants found for league with ID ${leagueId}`);
        }

        return leagueMembers;
    }

    async isLeagueMember(leagueId: string, userId: string): Promise<boolean> {
        const leagueMember = await this.prismaService.leagueMember.findFirst({
            where: { leagueId, userId },
        });

        return !!leagueMember;
    }

    async getLeagueMembersByUserId(userId: string): Promise<LeagueMember[]> {
        const leagueMembers = await this.prismaService.leagueMember.findMany({
            where: { userId },
            include: {
                league: true,
            },
        });

        return leagueMembers;
    }

    async getSpecificLeagueMember(leagueId: string, userId: string): Promise<LeagueMember> {
        const leagueMember = await this.prismaService.leagueMember.findUnique({
            where: {
                leagueId_userId: {
                    leagueId,
                    userId,
                },
            },
            include: {
                user: true,
            },
        });

        if (!leagueMember) {
            throw new InternalServerErrorException(`League member not found for user ID ${userId} in league ID ${leagueId}`);
        }

        return leagueMember;
    }
}