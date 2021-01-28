import { UserSchema } from "../users/user.model";
import { getTokenFromRequest } from ".";
import * as _ from 'lodash';
const jwt = require('jsonwebtoken');
const moment = require('moment');
import { ObjectId } from 'mongodb';


export const requireJWTAuth = async (req: any, res: any, next: any) => {
    try {
        const token = await getTokenFromRequest(req);
        if (!token) {
            return res.status(401).send({ message: 'Verification Token Missing' });
        }
        let payload = jwt.verify(token, process.env.JWT_KEY);

        if (!payload) {
            return res.status(401).send({ message: 'Token verification failed' })
        }
        const user = await UserSchema.findById(new ObjectId(payload._id));
        req.user = user;
        next();
    } catch (error) {
        return res.status(422).json({
            'status': 'Error',
            'message': error.message || 'Error while checking token'
        });
    }
}


export const setCurrentUserInfo = async (req: any, res: any, next: any) => {
    try {
        if (req.user) {
            const userObj = JSON.parse(JSON.stringify(req.user));
            const userInfo = _.pick(userObj, '_id', 'email', 'name', 'role', 'createdAt', 'updatedAt', 'status') as any;
            req.currentUser = userInfo;
        }
    } catch (err) {
        return next(err);
    }

    next();
};


/**
 * Specific for Verification token validation checking
 */
export const preLogin = async (req: any, res: any, next: any) => {
    try {
        const token = await getTokenFromRequest(req);
        if (!token) {
            return res.status(401).send({ message: 'Verification Token Missing' });
        }

        let user: any;
        try {
            user = await UserSchema.findOne({ 'verify.token': token });
        } catch (e) {
            return res.status(422).json({
                'status': 'Error',
                'message': e.message || 'Error while checking token'
            });
        }
        if (!user) {
            return res.status(401).send({ message: 'Token Verification Failed' });
        }
        const isExpired = moment(user.verify.expiresIn).isBefore(moment());
        if (isExpired) {
            return res.status(401).send({ message: 'Token Expired' });
        }

        if (user && user.status.toLowerCase() === 'invited' || !isExpired) {
            req.user = user;
        } else {
            return res.status(401).send({ message: 'Token/User already verified' });
        }

        next();
    } catch (error) {
        return res.status(422).json({
            'status': 'Error',
            'message': error.message || 'Error while checking token'
        });
    }
};


