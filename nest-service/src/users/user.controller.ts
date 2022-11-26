import { Body, Controller, Get, HttpException, HttpStatus, Post, Req } from "@nestjs/common";
import { AppRequest, getUserIdFromRequest } from "shared";
import { User } from "./models";
import { UsersService } from "./services";

@Controller('api/users')
export class UserController {
    constructor(
        private userService: UsersService
    ) {}

    @Get()
    async findUser(@Req() req: AppRequest) {
        try {
            const user = await this.userService.findOne(getUserIdFromRequest(req));
    
            return {
                statusCode: HttpStatus.OK,
                message: 'OK',
                data: { user }
            }
        } catch (err) {
            throw new HttpException(
                `Internal Server Error: ${err}`,
                err.status || HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    @Post()
    async createUser(@Req() req: AppRequest, @Body() body) {
        const { userName } = body;
        if (!userName) {
            const statusCode = HttpStatus.BAD_REQUEST;
            req.statusCode = statusCode

            return {
                statusCode,
                message: 'User name is absent',
            }
        }

        try {
            const user: User = await this.userService.createOne(userName);

            return {
                statusCode: HttpStatus.OK,
                message: 'OK',
                data: { user }
            }
        } catch (err) {
            throw new HttpException(
                `Internal Server Error: ${err}`,
                err.status || HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }
}