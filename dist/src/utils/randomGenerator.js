"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomOTPGenerator = void 0;
const randomOTPGenerator = (length = 6) => {
    let str = "";
    for (let i = 0; i < length; i++) {
        str += Math.floor(Math.random() * 10);
    }
    return str;
};
exports.randomOTPGenerator = randomOTPGenerator;
