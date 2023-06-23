import { IsEmail, IsNotEmpty, IsString } from "class-validator"

export class AuthDto{
    // using class-validator
    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsString()
    @IsNotEmpty()
    password: string
}