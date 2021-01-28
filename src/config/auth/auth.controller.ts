import { Controller, JsonController, Post, Body, Req, Res, UseBefore, Get, CurrentUser, Authorized } from "routing-controllers";
import { OpenAPI } from "routing-controllers-openapi";
import { Response, Request } from "express";
import { Inject } from "typedi";
import { UserService } from "../../modules/users/user.service";
const jwt = require('jsonwebtoken');
import _ = require('lodash');
import { requireJWTAuth, setCurrentUserInfo } from "./auth.middleware";
import { Current } from "../../modules/users/user.model";

@Controller()
@JsonController('/auth')
export class AuthController {

    constructor() { }

    @Inject()
    userService: UserService = new UserService();

    @Post('/signIn')
    @OpenAPI({ summary: 'User sign in', operationId: 'signIn' })
    async signIn(@Body() user: any, @Req() request: Request, @Res() response: Response) {
        const foundUser: any = await this.userService.findByEmail(user.email);
        if (foundUser && foundUser.email) {
            if (foundUser.authenticate(user.password)) {
                const token = jwt.sign(
                    {
                        _id: foundUser._id
                    }, process.env.JWT_KEY, {
                    expiresIn: '1h'
                })

                return response.status(200).json({
                    token: token,
                    user: _.pick(foundUser, '_id', 'name', 'email', 'createdAt', 'updatedAt') as any
                });
            } else {
                return response.status(422).json({ message: 'Email or password you’ve entered is incorrect.' });
            }
        } else {
            return response.status(422).json({ message: 'Email or password you’ve entered is incorrect.' });
        }
    }


    @Get('/self')
    @UseBefore(requireJWTAuth, setCurrentUserInfo)
    async self(@Res() res: Response, @Req() req: any) {
        return res.status(200).json(req.currentUser);
    }


    @Authorized()
    @Get('/logout')
    async logout(@Res() res: Response, @Req() req: any, @CurrentUser() current: Current) {
        try {
            return res.sendStatus(204);
        } catch (error) {
            return res.status(422).json({ message: error.message || 'Error while logout!' });
        }
    }
}