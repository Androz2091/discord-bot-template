import { join } from "node:path";
import { google } from "googleapis";

const scopes = ["https://www.googleapis.com/auth/spreadsheets.readonly"];

const auth = new google.auth.GoogleAuth({
	keyFilename: join(import.meta.dirname, "..", "..", "google-creds.json"),
	scopes,
});

export interface ParameterData {
	key: string;
	value: string;
}

export const parameters: ParameterData[] = [];

export const getParameters = () => parameters;

export const syncSheets = () => {
	return new Promise((resolve) => {
		google
			.sheets("v4")
			.spreadsheets.get({
				spreadsheetId: process.env.SPREADSHEET_ID,
				auth,
				includeGridData: true,
			})
			.then((res) => {
				// biome-ignore lint: sheets is going to be filled
				const parameterData = res.data.sheets![0]!.data![0].rowData;
				const newParameters: ParameterData[] = [];
				// biome-ignore lint: sheets is going to be filled
				for (let i = 1; i < parameterData!.length; i++) {
					// biome-ignore lint: sheets is going to be filled
					const row = parameterData![i].values!;
					// biome-ignore lint: sheets is going to be filled
					const key = row[0].formattedValue!;
					if (!key) continue;
					// biome-ignore lint: sheets is going to be filled
					const value = row[1].formattedValue!;
					newParameters.push({
						key,
						value,
					});
				}
				const data = { newParameters };
				console.log(data);
				resolve(data);
			});
	});
};
