import { JSONSchema } from 'class-validator-jsonschema';
import { IsOptional, IsMongoId, IsString, IsEnum } from 'class-validator';
import { Schema, Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { emailRegex } from './user.service'
import { Type } from 'class-transformer';

const Cryptr = require('cryptr');
const cryptr = new Cryptr('RomanEmpire@123');

export enum UserRole {
    Admin = 'Admin',
    Manager = 'Manager',
    RegularUser = 'RegularUser'
}

export enum UserStatus {
    Invited = 'Invited',
    Active = 'Active'
}

export interface Current {
    user: User;
}

@JSONSchema({ description: 'User' })
export class User {

    @IsOptional()
    @IsMongoId()
    _id?: string;

    @IsString()
    name!: String;

    @IsString()
    email!: String;

    @IsString()
    password!: String;

    @IsOptional()
    @IsEnum(UserRole)
    role!: UserRole;

    @IsOptional()
    @IsEnum(UserStatus)
    status!: UserStatus;

    @IsOptional()
    @Type(() => Object)
    verify: any;

}

/*
 User Schema
*/
const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        lowercase: true,
        unique: [true, 'User with this email address is already exist'],
        required: true
    },
    password: {
        type: String,
        required: true
    },
    verify: {
        token: {
            type: String
        },
        expiresIn: {
            type: Date
        }
    },
    role: {
        type: String,
        default: UserRole.Admin,
        enum: Object.keys(UserRole)
    },
    status: {
        type: String,
        default: UserStatus.Invited,
        enum: Object.keys(UserStatus)
    },
}, {
    timestamps: true,
    collection: 'users'
});

userSchema.pre('save', async function (next) {
    const user: any = this;

    if (!emailRegex.test(user.email)) {
        throw new Error('Email is not valid');
    }

    /**
      Check for existing email
    **/
    const existingEmail: any = await UserSchema.findOne({ email: user.email });
    if (existingEmail && existingEmail.email) {
        throw new Error('Email is already registered..!!');
    }

    user.password = cryptr.encrypt(user.password);
    next();
});

userSchema.methods.authenticate = function (password: any) {
    return password === cryptr.decrypt(this.password);
};


export type MUser = Document & User;
export const UserSchema = mongoose.model('User', userSchema);

