import { ForbiddenException, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from "argon2";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
    // Business logic is written in service file
    constructor(private prisma: PrismaService,
                private jwt: JwtService,
                private config: ConfigService) { }
    async signup(dto: AuthDto) {
        // generate the hashed password
        const hash = await argon.hash(dto.password);
        // save the new user in the database
        try {
            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    hash,
                },
            });

            // delete user.hash;   // for now we just delete the hashed password as we don't want to display it
            // return the saved user
            // return user;
            return this.signToken(user.id, user.email)
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.FORBIDDEN,
                error: 'Credentials already taken',
            }, HttpStatus.FORBIDDEN, {
                cause: error
            });
        }
        // this catch is not working
        //  catch (error) {
        //     if (error instanceof PrismaClientKnownRequestError) {
        //         if (error.code === 'P2002') {
        //             // P2002 status code means you are creating a duplicate record for a field which is declared unique
        //             throw new ForbiddenException('Credentials taken');
        //         }
        //     }
        //     throw error;
        // }
    }

    async signin(dto: AuthDto) {

        // find the user by email
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email,
            },
        });

        // is user does not exist with the given email throw exception
        if (!user)
            throw new ForbiddenException('Incorrect credentials');

        // compare password
        const pwMatches = await argon.verify(user.hash, dto.password);

        // if password is incorrect throw exception
        if (!pwMatches)
            throw new ForbiddenException('Incorrect credentials');

        // send back the user
        // delete user.hash;
        // return user; 

        // instead of returing a user, we return a token
        return this.signToken(user.id, user.email)
    }

    async signToken(userId: number, email: string): Promise<{access_token: string}> {
        const payload = {
            sub: userId, // unique identifier for a sub field
            email
        }
        const secret = this.config.get('JWT_SECRET');

        const token = await this.jwt.signAsync(payload, {
            expiresIn: '15m',
            secret: secret,
        });
        return {
            access_token: token,
        };
    }
}

