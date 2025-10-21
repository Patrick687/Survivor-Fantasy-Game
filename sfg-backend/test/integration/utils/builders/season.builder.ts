import { CreateSeasonDto, SeasonEntity } from 'generated/graphql';

export class SeasonDataBuilder {
  private data: Partial<CreateSeasonDto> = {};

  withSeasonId(seasonId: SeasonEntity['seasonId']): this {
    this.data.seasonId = seasonId;
    return this;
  }

  withFilmingLocation(filmingLocation: SeasonEntity['filmingLocation']): this {
    this.data.filmingLocation = filmingLocation;
    return this;
  }

  withAirStartDate(airStartDate: SeasonEntity['airStartDate']): this {
    this.data.airStartDate = airStartDate;
    return this;
  }

  withAirEndDate(airEndDate: SeasonEntity['airEndDate']): this {
    this.data.airEndDate = airEndDate;
    return this;
  }

  withData(data: Partial<CreateSeasonDto>): this {
    this.data = { ...this.data, ...data };
    return this;
  }

  build(): CreateSeasonDto {
    return {
      seasonId: 1,
      filmingLocation: 'Default Location',
      airStartDate: new Date('2023-01-01T00:00:00Z').toISOString(),
      airEndDate: new Date('2023-12-31T23:59:59Z').toISOString(),
      ...this.data,
    };
  }
}

// import { CreateSeasonDto } from 'src/season/dto/create-season.dto';
// import { TestApp } from '../setup-nest-app';
// import { SeasonEntity } from 'src/season/season.entity';
// import { createSeasonMutation } from '../mutations';
// import { expectGraphQLSuccess } from '../graphql-assertions';

// export class SeasonBuilder {
//   constructor() {}

//   public static async build(
//     app: TestApp,
//     seasonInfo: CreateSeasonDto,
//   ): Promise<SeasonEntity> {
//     const response = await app.mutation<'createSeason'>(createSeasonMutation, {
//       input: {
//         ...seasonInfo,
//       },
//     });

//     expectGraphQLSuccess(response);
//     const seasonEntity = response.body.data.createSeason as SeasonEntity;

//     expect(seasonEntity).toBeDefined();
//     expect(seasonEntity.seasonId).toBe(seasonInfo.seasonId);
//     expect(seasonEntity.filmingLocation).toBe(seasonInfo.filmingLocation); // Fixed this line

//     if (seasonEntity.airStartDate && seasonInfo.airStartDate) {
//       expect(new Date(seasonEntity.airStartDate).toISOString()).toBe(
//         new Date(seasonInfo.airStartDate).toISOString(),
//       );
//     } else {
//       expect(seasonEntity.airStartDate).toBe(seasonInfo.airStartDate);
//     }

//     if (seasonEntity.airEndDate && seasonInfo.airEndDate) {
//       expect(new Date(seasonEntity.airEndDate).toISOString()).toBe(
//         new Date(seasonInfo.airEndDate).toISOString(),
//       );
//     } else {
//       expect(seasonEntity.airEndDate).toBe(seasonInfo.airEndDate);
//     }

//     return seasonEntity;
//   }
// }
