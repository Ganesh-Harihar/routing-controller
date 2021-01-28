import { User } from "../users/user.model";
import { Action } from 'routing-controllers';
import * as request from 'request-promise-native';

/**
 * Process current user with call to auth uri with token.
 * @param action Routing action
 * @param roles User roles
 */
export const authorizationChecker = async (action: Action, roles: string[]): Promise<boolean> => {
    return new Promise<boolean>(async (resolve, reject) => {
        try {
            const result = await getUserFromRequest(action.request, roles);
            action.request.currentUser = result.user;

            if (result.user) {
                resolve(true);
            }
        } catch (error) {
            resolve(false);
        }
    });
};

export const getUserFromRequest = async (actionRequest: any, roles: string[]): Promise<{
    user: User
}> => {
    return new Promise<{ user: User }>(async (resolve, reject) => {
        try {

            const token = await getTokenFromRequest(actionRequest);
            if (!token) {
                console.log('[Auth] Error: Token Missing');
                return reject();
            }

            const url = `http://localhost:3000/api/auth/self`;
            const options = {
                url: url,
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `${token}`
                },
                json: true
            };
            const user = await request(options) as User;


            if (!user) {
                console.log('[Auth] Error: No user from auth request');
                return reject();
            }


            /**
             * Check if user status is Active
             */
            // if (user && user.status.toLowerCase() !== 'active') {
            //     console.log('[Auth] user is not active.', JSON.stringify(user), user._id);
            //     return reject();
            // }

            resolve({
                user
            });
        } catch (error) {
            console.log('[AUTH] Error:', error);
            reject();
        }
    });
};


/**
 * Return current user and organization from request
 * @param action Routing action
 */
export const currentUserChecker = async (action: Action): Promise<any> => {
    return new Promise<any>((resolve, reject) => {
        if (!action.request.currentUser) {
            return resolve(undefined);
        }
        resolve({
            user: action.request.currentUser
        });
    });
};

/**
* Get token from request in that order: header, cookie, query
* @param req Express request object
*/
export const getTokenFromRequest = async (req: any): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
        let token: any = '';
        token = req.headers['authorization'] as string;
        if (!token) {
            token = req.cookies && req.cookies['_token'];
        }
        if (!token) {
            token = req.query['_token'];
        }
        resolve(token);
    });
}; 