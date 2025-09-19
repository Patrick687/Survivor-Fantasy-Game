import { Field, InputType } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

@InputType()
export class GetLeagueDto {
    @Field()
    @IsString({
        message: 'ID must be a string',
    })

    @Field()
    @IsNotEmpty({
        message: 'ID is required',
    })

    @Field()
    @IsUUID('all', {
        message: 'ID must be a valid UUID',
    })
    id: string;
}