import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as jwt from 'jsonwebtoken';

export interface TokenPayload extends jwt.JwtPayload {
    userId: string;
    username: string;
    email: string;
}

@Injectable()
export class TokenService {
    private readonly secretKey: string;

    constructor(
        private readonly configService: ConfigService
    ) {
        const secret = this.configService.get<string>('JWT_SECRET');
        if (!secret) {
            throw new Error('JWT_SECRET is not defined in the environment variables');
        }
        this.secretKey = secret;
    }

    generateToken(payload: TokenPayload): string {
        return jwt.sign(payload, this.secretKey, {
            expiresIn: '1h'
        });
    }

    verifyToken(token: string): TokenPayload {
        try {
            return jwt.verify(token, this.secretKey) as TokenPayload;
        } catch (error: any) {
            if (error.name === 'TokenExpiredError') {
                throw new UnauthorizedException('Session timed out. Please log in again.');
            }
            throw new UnauthorizedException('Invalid token');
        }
    }

    decodeToken(token: string): TokenPayload {
        const decoded = jwt.decode(token) as TokenPayload | null;
        if (!decoded) {
            throw new UnauthorizedException('Invalid token');
        }
        return decoded;
    }
}