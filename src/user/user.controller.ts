import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtGaurd } from 'src/auth/gaurd';

@Controller('users')
export class UserController {
    @UseGuards(JwtGaurd)
    // /users --> if Get() is left blank then it will catch all the requests
    // Get('me') ---> /users/me means it will catch all the specific get requests
    @Get('me')
    getMe(@Req() req: Request) {
        console.log({
            user: req.user,
        });
        return req.user;
        // return 'user info';
    }
}


