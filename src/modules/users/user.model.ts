import { JSONSchema } from 'class-validator-jsonschema';
import { IsOptional, IsMongoId, IsString } from 'class-validator';
import { Schema, Document } from 'mongoose';
import mongoose from 'mongoose';
import { emailRegex } from './user.service'

const Cryptr = require('cryptr');
const cryptr = new Cryptr('RomanEmpire@123');

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
        required: true
    },
    password: {
        type: String,
        required: true
    }
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

