"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
exports.default = ({ env }) => ({
    connection: {
        client: env('DATABASE_CLIENT', 'sqlite'),
        connection: {
            filename: env('DATABASE_FILENAME', path_1.default.join(__dirname, '..', '..', '.tmp', 'data.db')),
        },
        useNullAsDefault: true,
    },
});
