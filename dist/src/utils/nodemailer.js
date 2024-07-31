"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = sendEmail;
exports.sendRegisterationLink = sendRegisterationLink;
const nodemailer_1 = __importDefault(require("nodemailer"));
function sendEmail(email) {
    return __awaiter(this, void 0, void 0, function* () {
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_APP_PASSWORD,
            },
        });
        const options = {
            from: process.env.GMAIL_USER,
            to: email,
            subject: "The subject of the email",
            text: "The body of the email",
        };
        const info = yield transporter.sendMail(options);
    });
}
function sendRegisterationLink(userEmail, token) {
    return __awaiter(this, void 0, void 0, function* () {
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_APP_PASSWORD,
            },
        });
        const options = {
            from: process.env.GMAIL_USER,
            to: userEmail,
            subject: "Registeration Email",
            text: `Please click the link below to create a new account.
    </br>
    <a href='http://localhost:5173/sign-up?token=${token}'>link</a>    
    `,
        };
        const info = yield transporter.sendMail(options);
        return info.messageId;
    });
}
