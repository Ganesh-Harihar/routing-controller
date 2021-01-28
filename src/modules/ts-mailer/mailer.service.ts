import { Service } from "typedi";
const nodemailer = require("nodemailer");

@Service()
export class MailService {

    constructor() { }
    sendMail(headers: any, template: any) {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            secure: false,
            auth: {
                user: 'romanreign144@gmail.com',
                pass: 'Romanr@14498.'
            }, tls: {
                rejectUnauthorized: false
            }
        });

        var mailOptions = {
            from: 'romanreign144@gmail.com',
            to: headers.to,
            subject: 'Sending mail via routing controller express server',
            html: template,
        }
        transporter.sendMail(mailOptions, function (error: any, info: any) {
            if (error) {
                throw new Error('Error while sending mail!');
            }
        });
    }
}