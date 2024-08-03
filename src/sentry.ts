import * as Sentry from "@sentry/node";
import { rewriteFramesIntegration } from "@sentry/integrations";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

global.__rootdir__ = __dirname || process.cwd();
global.__rootdir__ = __dirname || process.cwd();
declare global {
    var __rootdir__: string;
}

if (process.env.SENTRY_API_KEY) {
    Sentry.init({
        dsn: process.env.SENTRY_API_KEY,
        tracesSampleRate: 1.0,
        integrations: [
            rewriteFramesIntegration({
                root: global.__rootdir__
            })
        ]
    });
}
