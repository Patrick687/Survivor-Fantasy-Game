import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { TokenPayload, TokenService } from "./token/token.service";
import { Request } from "express";

export interface UserContext {
    req: Request & {
        payload: TokenPayload;
    };
}

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly tokenService: TokenService) { }

    canActivate(context: ExecutionContext) {
        const ctx = GqlExecutionContext.create(context);
        const req = (ctx.getContext() as UserContext).req;
        const authHeader = req.headers['authorization'];

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedException('No bearer token provided');
        }

        const token = authHeader.split(' ')[1];
        const payload = this.tokenService.verifyToken(token);

        req.payload = payload;

        return true;
    }
}