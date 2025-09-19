import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { LEAGUE_NAME_MAX_LENGTH, LEAGUE_NAME_MIN_LENGTH, LEAGUE_NAME_PATTERN } from "src/common/validation.constants";

@InputType()
export class CreateLeagueDto {
    @Field()
    @IsString({ message: 'Name must be a string' })
    @IsNotEmpty({ message: 'Name is required' })
    @MinLength(LEAGUE_NAME_MIN_LENGTH, {
        message: `Name must be at least ${LEAGUE_NAME_MIN_LENGTH} characters long`,
    })
    @MaxLength(LEAGUE_NAME_MAX_LENGTH, {
        message: `Name can only be up to ${LEAGUE_NAME_MAX_LENGTH} characters long`,
    })
    @Matches(LEAGUE_NAME_PATTERN, {
        message: 'Name can only contain letters, numbers, and spaces',
    })
    name: string;

    @Field()
    @IsString({ message: 'Season ID must be a string' })
    @IsNotEmpty({ message: 'Season ID is required' })
    seasonId: string;

}