# MoMo Bot

[🇹🇭 ฉบับภาษาไทย](./README_TH.md)

A Discord bot built with Discord.js that provides fun and utility commands for Discord servers.

## Features

### Utility Commands
- **ping** - Check bot latency and responsiveness
- **echo** - Repeat messages
- **guide** - Get help and guidance
- **info** - Get information about users or server
- **reload** - Reload commands
- **server** - Server information
- **user** - User information

### Music Commands
- **play** - Play music from YouTube or URL
- **stop** - Stop playing music
- **next** - Skip to the next song
- **disconnect** - Disconnect bot from voice channel

### Fun Commands
- **dog** - Get cute pictures of dogs (with breed options, supports multiple languages: Polish, German)
- **gif** - Get GIF images

## Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn
- Discord bot token (from Discord Developer Portal)

## Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd MoMo_Bot
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create a `.env` file in the root directory and add your Discord bot token:**
   ```
   TOKEN=your_discord_bot_token_here
   ```

   > Get your token from the [Discord Developer Portal](https://discord.com/developers/applications)

## Usage

### Starting the Bot

```bash
node index.js
```

The bot will:
- Load all commands from the `commands/` directory
- Register event listeners from the `events/` directory
- Connect to Discord using your token

### Deploying Commands

To deploy slash commands to Discord:

```bash
node deploy-commands.js
```

### Deleting Commands

To delete all registered slash commands:

```bash
node deleteCommands.js
```

### Reloading Commands

Use the `/reload` command in Discord to reload commands without restarting the bot.

## Project Structure

```
MoMo_Bot/
├── index.js                 # Main bot entry point
├── deploy-commands.js       # Deploy slash commands to Discord
├── deleteCommands.js        # Delete all slash commands
├── package.json             # Project dependencies
├── .env                     # Environment variables (TOKEN, LAVALINK_*)
├── .gitattributes          # Git configuration
├── commands/                # All bot commands
│   ├── fun/                # Fun commands
│   │   ├── dog.js
│   │   └── gif.js
│   ├── music/              # Music commands (Lavalink-based)
│   │   ├── play.js
│   │   ├── stop.js
│   │   ├── next.js
│   │   └── disconnect.js
│   └── utility/            # Utility commands
│       ├── echo.js
│       ├── guide.js
│       ├── info.js
│       ├── ping.js
│       ├── reload.js
│       ├── server.js
│       └── user.js
└── events/                 # Event handlers
    ├── interactionCreate.js # Handle slash command interactions
    ├── ready.js           # Bot ready event
    ├── raw.js             # Raw Discord API events
    └── lavalink/          # Lavalink music node events
        ├── nodeConnect.js
        ├── nodeError.js
        ├── nodeReconnect.js
        ├── queueEnd.js
        └── trackStart.js
```

## Dependencies

- **discord.js** (^14.25.1) - Discord API library for Node.js
- **dotenv** (^17.2.3) - Environment variable loader
- **riffy** (^1.0.8) - Lavalink wrapper for music features
- **@discordjs/voice** (^0.19.0) - Voice channel support
- **play-dl** (^1.9.7) - Audio download library
- **ytdl-core** (^4.11.5) - YouTube downloader
- **ffmpeg-static** (^5.3.0) - FFmpeg for audio processing

## Development Notes

- Commands support **slash commands** (Discord's newer command system)
- Commands support **localization** (multiple language support)
- **Cooldown system** is implemented to prevent command spam
- **Music system** powered by Lavalink (requires a running Lavalink server)
- **Event-driven architecture** for extensibility
- Uses **Riffy** for managing music playback and queue management

## Command Features

- **Slash Commands**: Use Discord's slash command interface (`/command-name`)
- **Cooldowns**: Many commands have cooldown periods to prevent abuse
- **Localization**: Some commands support multiple languages (Polish, German, etc.)
- **Options**: Commands accept optional parameters (e.g., `/dog breed:labrador`)

## License

Not specified

## Support

For issues or questions, please create an issue in the repository.

---

**Created by:** CableMoMo2027  
**Repository:** [MoMo_Bot](https://github.com/CableMoMo2027/MoMo_Bot)
