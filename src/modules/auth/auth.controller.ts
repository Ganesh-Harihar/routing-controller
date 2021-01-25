import { Controller, JsonController, Post, Body, Req, Res, UseBefore } from "routing-controllers";
import { OpenAPI } from "routing-controllers-openapi";
import { Request, Response } from "express";
import { Inject } from "typedi";
import { UserService } from "../users/user.service";
const jwt = require('jsonwebtoken');
import _ = require('lodash');

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
                    expiresIn: 60
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
}