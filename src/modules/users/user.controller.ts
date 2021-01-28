import { Controller, Param, Body, Get, Post, Put, Delete, JsonController, Req, Res, UseBefore, CurrentUser } from 'routing-controllers';
import { Inject } from 'typedi';
import { UserService } from './user.service';
import { OpenAPI } from 'routing-controllers-openapi';
import { Response, Request } from 'express';
import { User } from './user.model';
import { MailService } from '../ts-mailer/mailer.service';

@Controller()
@JsonController('/users')
export class UserController {

    constructor() { }

    @Inject()
    userService: UserService = new UserService();

    @Inject()
    mailerService: MailService = new MailService;

    @Get('/')
    @UseBefore()
    @OpenAPI({ summary: 'Get list of all the users', operationId: 'getAll' })
    async getAll(@Req() request: Request, @Res() response: Response) {
        try {
            const users = await this.userService.list();
            return response.status(200).json({
                'status': 'Success',
                'data': users
            });
        } catch (error) {
            return response.status(422).json({
                'status': 'Error',
                'message': error.message || 'Error while getting users list'
            });
        }
    }

    @Get('/:id')
    @OpenAPI({ summary: 'Get user by user id', operationId: 'getUserById' })
    async getUserById(@Param('id') id: string, @Req() request: Request, @Res() response: Response) {
        try {
            const user = await this.userService.findById(id);
            return response.status(200).json({
                'status': 'Success',
                'data': user
            });
        } catch (error) {
            return response.status(422).json({
                'status': 'Error',
                'message': error.message || 'Error while getting user'
            });
        }
    }

    @Post('/')
    @OpenAPI({ summary: 'sign up', operationId: 'signUp' })
    async signUp(@Body() user: User, @Res() response: Response) {
        try {
            if (!this.userService.isPasswordStrong(user.password.toString())) {
                throw new Error(`Password did not fullfil its minimum policies`);
            }

            const createdUser = await this.userService.create(user);
            /**
            * Create Verification link and send email
            */
            const verificationToken = await this.userService.generateVerificationToken(createdUser);
            const verificationLink = `http://localhost:3000/auth/activate-user?verify=${verificationToken}`;

            const headers = {
                to: createdUser.email
            }

            const template = `<h2>Hello ${createdUser.name}, <br>to activate yourself please click below link
            <a href=${verificationLink}>Activate</a>`

            this.mailerService.sendMail(headers, template);

            return response.status(200).json({
                'status': 'Success',
                'data': createdUser
            });
        } catch (error) {
            return response.status(422).json({
                'status': 'Error',
                'message': error.message || 'Error while creating user'
            });
        }
    }

    @Put('/:id')
    @OpenAPI({ summary: 'Update user by user id', operationId: 'update' })
    async update(@Param('id') id: string, @Body() user: any, @Req() request: Request, @Res() response: Response) {
        try {
            const updatedUser = await this.userService.update(id, user);
            return response.status(200).json({
                'status': 'Success',
                'data': updatedUser
            });
        } catch (error) {
            return response.status(422).json({
                'status': 'Error',
                'message': error.message || 'Error while updating user'
            });
        }
    }

    @Delete('/:id')
    @OpenAPI({ summary: 'Remove user by user id', operationId: 'remove' })
    async remove(@Param('id') id: string, @Req() request: Request, @Res() response: Response) {
        try {
            await this.userService.delete(id);
            return response.status(200).json({
                'status': 'Success',
            });
        } catch (error) {
            return response.status(422).json({
                'status': 'Error',
                'message': error.message || 'Error while deleting user'
            });
        }
    }
}