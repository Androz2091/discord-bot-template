# Discord Bot Template

Your bot has been delivered! Here is the repository with the source code. As a reminder, here are the features of the bot:

* Made using TypeScript 💻
* Simple Command Handler 📡
* Slash Commands 🚨

## Installation

You can install and host this bot on your own server. Here are the main steps:

* Download and install [Node.js](https://nodejs.org) v16 or higher.
* Download and install [PostgreSQL](https://www.postgresql.org) v13 or higher.
* Create a new database and a new role that has access to the database.
* Install the dependencies of the project by running `yarn install`.
* Install PM2 or another process manager to keep your bot alive. If not you can just run `tsc` to run the bot.
* You're are done!

## Configuration 
All configuration for this template can be made in the ``.env`` file found in the root directory. Below will be details about each setting.  
  
`DISCORD_CLIENT_TOKEN:` Your Discord Bot's token which you can find [Here](https://discord.com/developers/applications).  
  
`DB_NAME:` Your Database name which you created using [PostgreSQL](https://www.postgresql.org).  
`DB_USERNAME:` Your username to login to your Database.  
`DB_PASSWORD:` Your password to login to your Database under the username above.  
  
`EMBED_COLOR:` The color which you would like your embed's side bar to be. (BLUE, #FF0000, Ect.)  
  
`COMMAND_PREFIX:` The prefix attached to a command name to execute that command.  
  
`GUILD_ID:` The guild which the bot will create Slash Commands on.
  
`ENVIRONMENT:` N/A  
## Bugs or questions

If you have any issue or bug with this bot, you can contact me using Discord, `Androz#2091`.
