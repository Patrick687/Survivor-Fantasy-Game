import { PrismaService } from 'src/prisma/prisma.service';
import { BaseRepository } from './base.repository';

describe('BaseRepository', () => {
  let prismaService: PrismaService;
  let repo: BaseRepository;

  beforeEach(() => {
    prismaService = {} as PrismaService;
    repo = new BaseRepository(prismaService);
  });

  it('should return prismaService if no transaction client is provided', () => {
    expect(repo['getPrismaClient']()).toBe(prismaService);
  });

  it('should return the transaction client if provided', () => {
    const tx = { $transaction: jest.fn() } as any;
    expect(repo['getPrismaClient'](tx)).toBe(tx);
  });
});
