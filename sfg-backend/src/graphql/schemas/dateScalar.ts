import { CustomScalar, Scalar } from "@nestjs/graphql";

@Scalar('Date')
export class DateScalar implements CustomScalar<string, Date> {
    description = 'Date custom scalar type';

    parseValue(value: string): Date {
        return new Date(value); // value from the client
    }

    serialize(value: Date): string {
        return value.toISOString(); // value sent to the client
    }

    parseLiteral(ast: any): Date {
        if (ast.kind === 'StringValue') {
            return new Date(ast.value);
        }
        throw new Error('Date scalar can only parse string values');
    }


}