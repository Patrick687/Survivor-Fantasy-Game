import { Prisma } from '@prisma/client';

// Base types - exactly what Prisma expects
export type SurvivorCreateData = Prisma.SurvivorUncheckedCreateInput;
export type SeasonCreateData = Prisma.SeasonUncheckedCreateInput;
export type SeasonSurvivorCreateData =
  Prisma.SeasonSurvivorUncheckedCreateInput;

// Seeding context types - omit only what the seeder will provide
export type SurvivorForSeeding = Omit<
  SurvivorCreateData,
  'survivorId' | 'createdAt' | 'updatedAt'
>;

export type SeasonSurvivorForSeeding = Omit<
  SeasonSurvivorCreateData,
  'survivorId' | 'seasonId' | 'createdAt' | 'updatedAt'
>;

export type SeasonForSeeding = Omit<
  SeasonCreateData,
  'createdAt' | 'updatedAt'
>;

// Composite seeding type
export type SeasonWithSurvivorsForSeeding = SeasonForSeeding & {
  survivors: Array<
    SeasonSurvivorForSeeding & {
      survivor: SurvivorForSeeding;
    }
  >;
};
