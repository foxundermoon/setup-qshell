"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const installer = __importStar(require("./installer"));
const path = __importStar(require("path"));
async function run() {
    try {
        //
        // Version is optional.  If supplied, install / use from the tool cache
        // If not supplied then task is still used to setup proxy, auth, etc...
        //
        const version = core.getInput('qshell-version');
        if (version) {
            // TODO: installer doesn't support proxy
            await installer.getQshell(version);
        }
        // TODO: setup proxy from runner proxy config
        const matchersPath = path.join(__dirname, '..', '.github');
        console.log(`##[add-matcher]${path.join(matchersPath, 'tsc.json')}`);
        console.log(`##[add-matcher]${path.join(matchersPath, 'eslint-stylish.json')}`);
        console.log(`##[add-matcher]${path.join(matchersPath, 'eslint-compact.json')}`);
    }
    catch (error) {
        core.setFailed(error.message);
    }
}
run();
