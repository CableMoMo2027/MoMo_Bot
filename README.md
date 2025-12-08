# MoMo Bot

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
├── .env                     # Environment variables (TOKEN)
├── .gitattributes          # Git configuration
├── commands/                # All bot commands
│   ├── fun/                # Fun commands
│   │   ├── dog.js
│   │   └── gif.js
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
    └── ready.js           # Bot ready event
```

## Dependencies

- **discord.js** (^14.25.1) - Discord API library for Node.js
- **dotenv** (^17.2.3) - Environment variable loader

## Development Notes

- Commands support **slash commands** (Discord's newer command system)
- Commands support **localization** (multiple language support)
- **Cooldown system** is implemented to prevent command spam
- Event-driven architecture for extensibility

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

---

# MoMo Bot - ฉบับภาษาไทย

บอท Discord ที่สร้างด้วย Discord.js ที่ให้คำสั่งสนุก ๆ และคำสั่งยูทิลิตี้สำหรับ Discord servers

## คุณสมบัติ

### คำสั่งยูทิลิตี้
- **ping** - ตรวจสอบการตอบสนองของบอท
- **echo** - ทำซ้ำข้อความ
- **guide** - ได้รับความช่วยเหลือ
- **info** - ข้อมูลเกี่ยวกับผู้ใช้หรือเซิร์ฟเวอร์
- **reload** - โหลดคำสั่งใหม่
- **server** - ข้อมูลเซิร์ฟเวอร์
- **user** - ข้อมูลผู้ใช้

### คำสั่งสนุก ๆ
- **dog** - รูปภาพน้องหมาน่ารัก (มีตัวเลือกพันธุ์ รองรับหลายภาษา: โปแลนด์, เยอรมัน)
- **gif** - รูป GIF

## ข้อกำหนดเบื้องต้น

- Node.js (เวอร์ชัน 18 ขึ้นไปแนะนำ)
- npm หรือ yarn
- Discord bot token (จาก Discord Developer Portal)

## การติดตั้ง

1. **Clone repository:**
   ```bash
   git clone <repository-url>
   cd MoMo_Bot
   ```

2. **ติดตั้ง dependencies:**
   ```bash
   npm install
   ```

3. **สร้างไฟล์ `.env` ในโฟลเดอร์หลักและเพิ่ม Discord bot token:**
   ```
   TOKEN=your_discord_bot_token_here
   ```

   > ได้รับ token จาก [Discord Developer Portal](https://discord.com/developers/applications)

## วิธีใช้

### เริ่มต้นบอท

```bash
node index.js
```

บอทจะ:
- โหลดคำสั่งทั้งหมดจากโฟลเดอร์ `commands/`
- ลงทะเบียน event listeners จากโฟลเดอร์ `events/`
- เชื่อมต่อกับ Discord โดยใช้ token

### ปรับใช้คำสั่ง

ในการปรับใช้ slash commands ให้กับ Discord:

```bash
node deploy-commands.js
```

### ลบคำสั่ง

เพื่อลบคำสั่ง slash ทั้งหมดที่ลงทะเบียน:

```bash
node deleteCommands.js
```

### โหลดคำสั่งใหม่

ใช้คำสั่ง `/reload` ใน Discord เพื่อโหลดคำสั่งใหม่โดยไม่ต้องรีสตาร์ทบอท

## โครงสร้างโปรเจกต์

```
MoMo_Bot/
├── index.js                 # ไฟล์เริ่มต้นของบอท
├── deploy-commands.js       # ปรับใช้ slash commands ให้กับ Discord
├── deleteCommands.js        # ลบคำสั่ง slash ทั้งหมด
├── package.json             # Dependencies ของโปรเจกต์
├── .env                     # ตัวแปรสภาพแวดล้อม (TOKEN)
├── .gitattributes          # การตั้งค่า Git
├── commands/                # คำสั่งทั้งหมด
│   ├── fun/                # คำสั่งสนุก ๆ
│   │   ├── dog.js
│   │   └── gif.js
│   └── utility/            # คำสั่งยูทิลิตี้
│       ├── echo.js
│       ├── guide.js
│       ├── info.js
│       ├── ping.js
│       ├── reload.js
│       ├── server.js
│       └── user.js
└── events/                 # Event handlers
    ├── interactionCreate.js # จัดการ slash command interactions
    └── ready.js           # บอท ready event
```

## Dependencies

- **discord.js** (^14.25.1) - Discord API library สำหรับ Node.js
- **dotenv** (^17.2.3) - โปรแกรมอ่านตัวแปรสภาพแวดล้อม

## หมายเหตุการพัฒนา

- คำสั่งสนับสนุน **slash commands** (ระบบคำสั่งที่ใหม่กว่าของ Discord)
- คำสั่งสนับสนุน **localization** (รองรับหลายภาษา)
- **ระบบ cooldown** เพื่อป้องกันการใช้งานคำสั่งซ้ำ ๆ
- สถาปัตยกรรม Event-driven สำหรับความขยายได้

## คุณสมบัติของคำสั่ง

- **Slash Commands**: ใช้อินเทอร์เฟส slash command ของ Discord (`/command-name`)
- **Cooldowns**: คำสั่งจำนวนมากมีระยะเวลา cooldown เพื่อป้องกันการใช้งานวุ่นวาย
- **Localization**: คำสั่งบางคำรองรับหลายภาษา (โปแลนด์, เยอรมัน ฯลฯ)
- **Options**: คำสั่งยอมรับพารามิเตอร์เสริม (เช่น `/dog breed:labrador`)

## ลิขสิทธิ์

ไม่มีการระบุ

## การสนับสนุน

หากมีปัญหาหรือคำถาม โปรดสร้าง issue ใน repository

---

**สร้างโดย:** CableMoMo2027  
**Repository:** [MoMo_Bot](https://github.com/CableMoMo2027/MoMo_Bot)
