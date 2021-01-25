const jwt = require('jsonwebtoken');


/**
 * Specific for Verification token validation checking
 */
export const preLogin = async (req: any, res: any, next: any) => {
    try {
        const token = await getTokenFromRequest(req);
        if (!token) {
            return res.status(401).send({ message: 'Verification Token Missing' });
        }

        let payload = jwt.verify(token, process.env.JWT_KEY);

        if (!payload) {
            return res.status(401).send({ message: 'Token verification failed' })
        }

        next();
    } catch (error) {
        return res.status(422).json({
            'status': 'Error',
            'message': error.message || 'Error while checking token'
        });
    }
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