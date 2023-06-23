import { IsDate, IsDateString, IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Matches, MinLength } from "class-validator"

export class AuthDto {
    // using class-validator

    @IsString()
    @IsNotEmpty()
    name: string;

    @Matches(/^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/, {
        message: 'Phone number is not valid',
    })
    phone: string;
    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsString()
    @IsNotEmpty()
    password: string

    @IsString()
    @IsNotEmpty()
    account_id: string

    @IsString()
    @MinLength(10)
    about: string;

    @IsString()
    portfolio: string;

    @IsString()
    attach_photo: string;

    @IsString()
    street_Address: string;

    @IsString()
    city: string;

    @IsString()
    state: string;

    @IsNumber()
    postal_Code: number;

    @IsString()
    country: string;

    @IsString()
    position_Last_Held: string;

    @IsString()
    company: string;

    @IsDateString()
    start_date: Date;

    @IsDateString()
    end_date: Date;


    // @IsEnum(Role)
    // @IsNotEmpty()
    // role: string;

}