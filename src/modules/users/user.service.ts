
import { Service } from 'typedi';
import { UserSchema, User } from './user.model';
export const emailRegex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

@Service()
export class UserService {

    constructor() { }
    async list(): Promise<any> {
        return await UserSchema.find().exec();
    }

    async create(user: User): Promise<any> {
        const userSchema = new UserSchema(user);
        return await userSchema.save();
    }

    async findById(userId: String): Promise<any> {
        return await UserSchema.findById(userId);
    }

    async findByEmail(email: String): Promise<any> {
        return await UserSchema.findOne({ 'email': email });
    }

    async delete(userId: String): Promise<any> {
        return await UserSchema.findByIdAndDelete(userId);
    }

    async update(userId: string, user: User): Promise<any> {
        return await UserSchema.findOneAndUpdate(userId, user, { new: true })
    }

    isPasswordStrong(password: string) {
        // tslint:disable-next-line:max-line-length
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,20}$/;
        return passwordRegex.test(password);
    }
}