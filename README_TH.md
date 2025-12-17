# MoMo Bot - ฉบับภาษาไทย

[🇬🇧 English Version](./README.md)

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

### คำสั่งเพลง
- **play** - เล่นเพลงจาก YouTube, Spotify หรือ URL (รองรับ playlist)
- **queue** - ดูคิวเพลงปัจจุบันพร้อมระบบแบ่งหน้า
- **playqueue** - เลือกเล่นเพลงที่ต้องการจากคิว
- **skip** - ข้ามไปยังเพลงถัดไปในคิว
- **pause** - หยุดชั่วคราว/เล่นต่อเพลงปัจจุบัน
- **loop** - สลับโหมดวนซ้ำ (ปิด/เพลงเดียว/ทั้งคิว)
- **clear** - ล้างเพลงทั้งหมดในคิว
- **leave** - ตัดการเชื่อมต่อบอทจากช่องเสียง
- **247** - สลับโหมด 24/7 (บอทอยู่ในช่องเสียงตลอด)

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
├── .env                     # ตัวแปรสภาพแวดล้อม (TOKEN, LAVALINK_*)
├── .gitattributes          # การตั้งค่า Git
├── commands/                # คำสั่งทั้งหมด
│   ├── fun/                # คำสั่งสนุก ๆ
│   │   ├── dog.js
│   │   └── gif.js
│   ├── music/              # คำสั่งเพลง (Lavalink-based)
│   │   ├── play.js         # เล่นเพลงจาก URL/ค้นหา
│   │   ├── queue.js        # ดูคิวพร้อมแบ่งหน้า
│   │   ├── playqueue.js    # เลือกเพลงจากคิวเพื่อเล่น
│   │   ├── skip.js         # ข้ามเพลงปัจจุบัน
│   │   ├── pause.js        # หยุดชั่วคราว/เล่นต่อ
│   │   ├── loop.js         # โหมดวนซ้ำ (ปิด/เพลง/คิว)
│   │   ├── clear.js        # ล้างคิว
│   │   ├── leave.js        # ออกจากช่องเสียง
│   │   └── 247.js          # โหมด 24/7
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
    ├── ready.js           # บอท ready event
    ├── raw.js             # Raw Discord API events
    └── lavalink/          # Lavalink music node events
        ├── nodeConnect.js
        ├── nodeError.js
        ├── nodeReconnect.js
        ├── queueEnd.js
        └── trackStart.js
```

## Dependencies

- **discord.js** (^14.25.1) - Discord API library สำหรับ Node.js
- **dotenv** (^17.2.3) - โปรแกรมอ่านตัวแปรสภาพแวดล้อม
- **riffy** (^1.0.8) - Lavalink wrapper สำหรับฟีเจอร์เพลง
- **@discordjs/voice** (^0.19.0) - รองรับช่องเสียง
- **play-dl** (^1.9.7) - ไลบรารีดาวน์โหลดเสียง
- **ytdl-core** (^4.11.5) - YouTube downloader
- **ffmpeg-static** (^5.3.0) - FFmpeg สำหรับประมวลผลเสียง

## หมายเหตุการพัฒนา

- คำสั่งสนับสนุน **slash commands** (ระบบคำสั่งที่ใหม่กว่าของ Discord)
- คำสั่งสนับสนุน **localization** (รองรับหลายภาษา)
- **ระบบ cooldown** เพื่อป้องกันการใช้งานคำสั่งซ้ำ ๆ
- **ระบบเพลง** ขับเคลื่อนโดย Lavalink (ต้องมีเซิร์ฟเวอร์ Lavalink ที่ทำงาน)
- **สถาปัตยกรรม Event-driven** สำหรับความขยายได้
- ใช้ **Riffy** สำหรับจัดการการเล่นเพลงและการจัดการคิว

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
