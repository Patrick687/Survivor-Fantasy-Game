import { Module } from "@nestjs/common";
import { UserModule } from "src/user/user.module";
import { AuthResolver } from "./auth.resolver";
import { TokenModule } from "./token/token.module";
import { AuthService } from "./auth.service";
import { AuthGuard } from "./auth.guard";
import { PasswordModule } from "./password/password.module";

@Module({
    imports: [TokenModule, UserModule, PasswordModule],
    providers: [AuthResolver, AuthService, AuthGuard],
    exports: [AuthGuard],
})
export class AuthModule { }