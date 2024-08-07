"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IStoredAt = exports.IStatus = exports.Role = void 0;
var Role;
(function (Role) {
    Role["ADMIN"] = "ADMIN";
    Role["USER"] = "USER";
})(Role || (exports.Role = Role = {}));
var IStatus;
(function (IStatus) {
    IStatus["ACTIVE"] = "ACTIVE";
    IStatus["INACTIVE"] = "INACTIVE";
})(IStatus || (exports.IStatus = IStatus = {}));
var IStoredAt;
(function (IStoredAt) {
    IStoredAt["AMBIENT"] = "AMBIENT";
    IStoredAt["CHILLED"] = "CHILLED";
    IStoredAt["FRUTES AND VEG"] = "FRUTES AND VEG";
})(IStoredAt || (exports.IStoredAt = IStoredAt = {}));
