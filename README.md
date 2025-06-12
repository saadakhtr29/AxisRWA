# 🌐 AXISRWA – Blockchain-Powered Fractional Ownership Platform

**AXISRWA** is a full-stack cross-platform application that allows users to invest in real-world assets (RWAs) through **fractional ownership using Ethereum (ERC-20 tokens)** and earn recurring **ROI via Sui-based tokens**. The platform supports investors, asset partners, administrators, and auditors (listeners) under a unified system—accessible via web and mobile.

---

## 🚀 Project Overview

- **Ownership Tokens (ERC-20)**: Tokenized shares of real estate, F&B, EV infra, etc.
- **ROI Tokens (Sui)**: Dynamically minted tokens representing monthly/quarterly returns.
- **Roles Supported**: Investor, Partner (Asset Owner), Admin, Listener (Auditor)
- **Apps**: Web (React.js) & Mobile (React Native for Android & iOS)
- **Tech Stack**: Full JavaScript (No TypeScript)

---

## 📱 Platform Demo

> Coming Soon: Live Demo + Screenshots  
> 🌐 Web App: `https://app.axisrwa.com`  
> 📲 Mobile App: Available soon on Play Store & App Store

---

## 🧱 Tech Stack

### 🔗 Blockchain
- **Ethereum (ERC-20)** – Ownership tokens
- **Sui** – ROI tokens with dynamic minting

### 🌐 Web & Mobile
- **Frontend**: React.js (Web), React Native (Mobile)
- **Backend**: Node.js, Express
- **Auth**: Firebase + JWT
- **Database**: PostgreSQL with Prisma ORM

---

## 📂 Project Structure

```
axisrwa/
├── backend/               # Node.js + Express API
│   ├── controllers/
│   ├── routes/
│   ├── services/
│   ├── models/
│   └── config/
├── frontend/              # Web App (React.js)
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── utils/
├── mobile-app/            # React Native (Android/iOS)
│   ├── src/
│   │   ├── screens/
│   │   ├── components/
│   │   ├── services/
│   │   └── navigation/
├── smart-contracts/
│   ├── ethereum/          # Ownership ERC-20 contracts
│   └── sui/               # ROI Token modules (Move language)
├── prisma/                # Prisma DB schema
└── docs/                  # SRS, UI/UX, Figma, API docs
```

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL
- Firebase Account

## Setup

1. Clone the repository:

```bash
git clone https://github.com/saadakhtr29/AxisRWA.git
cd AxisRWA
```

2. Install dependencies:

```bash
# Install server dependencies
cd backend
npm install
```

3. Set up environment variables:

- Copy `.env.example` to `.env` in both client and server directories
- Fill in the required environment variables

4. Set up the database:

```bash
cd server
npx prisma migrate dev
```

5. Start the development servers:

```bash
# Start server (from backend directory)
npm run dev
```

## Features

🔐 Authentication & Roles
Users are authenticated via Firebase

JWTs are used for session management

User roles include:

Investor

Partner (Asset Owner)

Admin

Listener (Auditor)

📈 Features
✅ Investors
Browse tokenized RWAs

Purchase fractional ownership using Ethereum

Track ROI and claim Sui-based ROI tokens

Access real-time asset dashboards

✅ Partners
Tokenize and list assets

Upload revenue reports

Track token sale progress

✅ Admins
Approve/reject assets

Monitor ROI distribution

Manage user roles & security

✅ Listeners
Verify revenue uploads

View ROI distribution audits

📄 API Documentation
API docs are available in /docs/api.md and can be imported via Postman.

OpenAPI/Swagger version: Coming Soon

🧾 Smart Contracts
Ethereum (ERC-20)
Token Contract per Asset

Ownership transferable

Governance capability (future)

Sui (ROI Token)
Minted based on revenue reports

Claimable by investors

Auditable by listeners

Contracts in /smart-contracts/ with audit notes
## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
