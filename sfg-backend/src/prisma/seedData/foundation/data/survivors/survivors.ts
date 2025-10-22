import { SurvivorForSeeding } from '../../../types/season-data.type';

export const survivorData: Record<string, SurvivorForSeeding> = {
  StephanieBerger: {
    firstName: 'Stephanie',
    lastName: 'Berger',
  },
  KevinLeung: {
    firstName: 'Kevin',
    lastName: 'Leung',
  },
  JustinPioppi: {
    firstName: 'Justin',
    lastName: 'Pioppi',
  },
  ThomasKrottinger: {
    firstName: 'Thomas',
    lastName: 'Krottinger',
  },
  BiancaRoses: {
    firstName: 'Bianca',
    lastName: 'Roses',
  },
  CharityNeims: {
    firstName: 'Charity',
    lastName: 'Neims',
  },
  SaiouniaHugley: {
    firstName: 'Saiounia',
    lastName: 'Hugley',
  },
  CedrekMcFadden: {
    firstName: 'Cedrek',
    lastName: 'McFadden',
  },
  ChrissySarnowsky: {
    firstName: 'Chrissy',
    lastName: 'Sarnowsky',
  },
  DavidKinne: {
    firstName: 'David',
    lastName: 'Kinne',
  },
  StarToomey: {
    firstName: 'Star',
    lastName: 'Toomey',
  },
  MaryZheng: {
    firstName: 'Mary',
    lastName: 'Zheng',
  },
  ShauhinDavari: {
    firstName: 'Shauhin',
    lastName: 'Davari',
  },
  MitchGuerra: {
    firstName: 'Mitch',
    lastName: 'Guerra',
  },
  KamillaKarthigesu: {
    firstName: 'Kamilla',
    lastName: 'Karthigesu',
  },
  JoeHunter: {
    firstName: 'Joe',
    lastName: 'Hunter',
  },
  EvaErickson: {
    firstName: 'Eva',
    lastName: 'Erickson',
  },
  KyleFraser: {
    firstName: 'Kyle',
    lastName: 'Fraser',
  },
} as const;

export type SurvivorDataKey = keyof typeof survivorData;
