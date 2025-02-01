import * as Sentry from "@sentry/node";

if (process.env.SENTRY_API_KEY) {
	Sentry.init({
		dsn: process.env.SENTRY_API_KEY,
		tracesSampleRate: 1.0,
		integrations: [],
	});
}
