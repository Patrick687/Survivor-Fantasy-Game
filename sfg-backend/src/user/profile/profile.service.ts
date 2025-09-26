import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Profile as ProfilePrisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProfileRepository } from './profile.repository';
import { Profile } from './profile.entity';

@Injectable()
export class ProfileService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly profileRepository: ProfileRepository,
  ) {}

  async getProfile(where: Prisma.ProfileWhereUniqueInput): Promise<Profile> {
    const profile = await this.profileRepository.findProfileByUnique(where);

    if (!profile) {
      let criteria = '';
      if (where.id) criteria = `id = '${where.id}'`;
      else if (where.userName) criteria = `userName = '${where.userName}'`;
      else if (where.userId) criteria = `userId = '${where.userId}'`;
      else criteria = JSON.stringify(where);

      throw new NotFoundException(`Profile where ${criteria} not found.`);
    }

    return profile;
  }

  async createProfile(
    data: Prisma.ProfileUncheckedCreateInput,
    prismaClient: PrismaService | Prisma.TransactionClient = this.prisma,
  ): Promise<Profile> {
    const profileRecord = await this.profileRepository.createProfile(
      data,
      prismaClient,
    );

    return profileRecord;
  }
}
