import expectValidate from 'src/test/utils/expectValidate';
import { CreateLeagueInput } from './create-league.input';
import { plainToInstance } from 'class-transformer';

describe('CreateLeagueInput Validation', () => {
  let cli: CreateLeagueInput;

  beforeEach(() => {
    cli = new CreateLeagueInput();
    cli.seasonId = 1;
    cli.name = 'Test League';
    cli.description = 'A league for testing';
  });

  it('should be valid with all correct fields', async () => {
    await expectValidate(cli);
  });

  it('should be valid with optional description omitted', async () => {
    cli.description = undefined;
    await expectValidate(cli);
  });

  it('should be invalid with missing required fields', async () => {
    // @ts-expect-error
    cli.seasonId = undefined;
    cli.name = '';
    await expectValidate(cli, ['seasonId', 'name']);
  });

  it('should be invalid with non-numeric seasonId', async () => {
    // @ts-expect-error
    cli.seasonId = 'not-a-number';
    await expectValidate(cli, ['seasonId']);
  });

  it('should be invalid with empty name', async () => {
    cli.name = '';
    await expectValidate(cli, ['name']);
  });

  it('should trim name and description', async () => {
    const input = {
      name: '   League Name   ',
      description: '   Some description   ',
      seasonId: 1,
    };
    const cli = plainToInstance(CreateLeagueInput, input);
    await expectValidate(cli);
    expect(cli.name).toBe('League Name');
    expect(cli.description).toBe('Some description');
  });
});
