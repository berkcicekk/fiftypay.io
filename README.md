# FiftyPay

<img width="3734" height="1923" alt="Ekran görüntüsü 2026-04-17 212141" src="https://github.com/user-attachments/assets/38f58789-c04b-479d-8a39-47af5724b79b" />


**Split the bill. Settle instantly on Stellar.**

FiftyPay is a browser-based web app that helps groups split shared expenses
(split-the-bill) and settle the resulting debts **instantly on the Stellar
network** using **XLM** and the **Freighter wallet**.

> MVP focus: a strong, premium UI + working core flows.  
> No backend or database in the MVP — data is stored in the browser via
> `LocalStorage`.

---

## Features (MVP)

- **Create events / groups** (e.g., “Antalya Trip”) and add participants
- **Add expenses** like: “Alice paid 100 XLM, split equally among
  Alice/Bob/Charlie”
- **Net balance calculation**: who is owed (+) and who owes (-)
- **Suggested settlements**: practical “who pays whom” routes using a **Greedy
  Match** approach
- **Pay with Stellar**: initiate XLM payments via **Freighter** (Testnet)
- **Upload receipts (MVP)**: upload a receipt file and store its metadata (no
  backend storage)
- **Pending payments**: separate views such as “I need to pay” vs “I should
  receive”

---

## Out of Scope (For Now)

- Smart contracts (Soroban / escrow)
- Authentication / user accounts
- Automatic on-chain verification and indexing
- Multi-currency support or advanced split types (MVP is **XLM only** + **equal
  split only**)

---

## Core Workflow

1. **Create an event** (e.g., “Antalya Trip”) and add participants
2. **Add expenses** (payer + amount + who shares it)
3. The app computes **net balances** for everyone
4. The app generates **suggested settlements**
5. Debtors click **Pay with Stellar** to send XLM via Freighter
6. After success, items can be marked as **Settled** (simple MVP flow)

---

## Tech Stack

- **Base:** Scaffold Stellar
- **Network:** Stellar Testnet / Local Network
- **Wallet:** Freighter
- **Storage:** Browser `LocalStorage` (MVP has no backend)
- **UI:** Dark, neo-fintech dashboard style (high contrast, premium cards)
- **Smart Contracts:** Soroban contracts for token management and game logic

---

## Deployed Smart Contracts (Local Network)

FiftyPay includes three Soroban smart contracts deployed on the local Stellar
network:

### 1. Guess The Number Contract

- **Contract ID:** `CDWGFOPHIJWUGESW7INHRY5XZ5634JW2EDP3NJX2BD7UXSM7XNJJLHOJ`
- **Description:** A simple game contract for guessing numbers
- **Admin:** `GDIPTOFTCOTLHOPWLTSHHKU5MAFPX5NXP4W77ROBOXYBQ2HFLNUJYJA7`

### 2. FiftyToken (Fungible Token with AllowList)

- **Contract ID:** `CCAMY4G6PNCHSNNJYJQKI3DXGBTU4G6AVJEB5JERVLJ3KX2MK5FXJSKY`
- **Token Name:** FiftyToken
- **Token Symbol:** FIFTY
- **Decimals:** 18
- **Initial Supply:** 1,000,000,000,000,000,000 (1 billion FIFTY)
- **Features:** SEP-41 compliant fungible token with allowlist extension for
  controlled transfers

### 3. FiftyNFT (Non-Fungible Token with Enumerable)

- **Contract ID:** `CA4CA3JZRM5OMNASNY24UNMW5ICKJFQQOV5JQXRIZ7OSCKYPZXM5IFW6`
- **NFT Name:** FiftyNFT
- **NFT Symbol:** FNFT
- **Features:** Enumerable NFT contract allowing enumeration of all token IDs
  and owner tracking

---

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Docker Desktop (for local Stellar network)
- Freighter wallet browser extension

### Installation & Setup

```bash
# install dependencies
npm install

# start Docker Desktop (required for local Stellar network)
# Then start dev server (automatically deploys contracts)
npm run dev
```

The app typically runs at:

- `http://localhost:5173` (or the port shown in your terminal)
- Local Stellar RPC: `http://localhost:8000/rpc`
- Local Horizon: `http://localhost:8000`

### Manual Contract Deployment

If contracts are not automatically deployed, you can deploy them manually:

```bash
# Build contracts
stellar contract build

# Deploy guess_the_number
stellar contract deploy \
  --wasm target/wasm32v1-none/release/guess_the_number.wasm \
  --source me \
  --network local \
  -- --admin me

# Deploy FiftyToken
stellar contract deploy \
  --wasm target/wasm32v1-none/release/fungible_allowlist_example.wasm \
  --source me \
  --network local \
  -- --name "FiftyToken" --symbol "FIFTY" --admin me --manager me --initial_supply 1000000000000000000

# Deploy FiftyNFT
stellar contract deploy \
  --wasm target/wasm32v1-none/release/nft_enumerable_example.wasm \
  --source me \
  --network local \
  -- --uri "https://fiftypay.io/nft" --name "FiftyNFT" --symbol "FNFT" --owner me
```

### Generate TypeScript Bindings

```bash
# Generate bindings for all contracts
stellar contract bindings typescript \
  --contract-id <CONTRACT_ID> \
  --output-dir packages/<package_name> \
  --overwrite \
  --network local

# Build packages
cd packages/<package_name>
npm run build
```

---

## Stellar & Freighter Notes (Testnet)

- Install the **Freighter** browser extension and switch to **Testnet**
- Fund your test account using a Stellar testnet faucet
- The payment flow opens Freighter for transaction signing

---

## Suggested Project Structure

- `src/pages` or `src/routes`: pages (Dashboard, etc.)
- `src/components`: reusable UI components (Card, Button, Modal)
- `src/lib/storage`: LocalStorage helpers (events, expenses, receipts)
- `src/lib/stellar`: Stellar/Freighter integration helpers
- `src/lib/settlements`: net balance + greedy match logic

> This structure is flexible — adapt it to your current repo layout. The main
> goal is keeping UI, storage, and calculation logic cleanly separated.

---

<img width="400" height="300" alt="image" src="https://github.com/user-attachments/assets/5501956b-61e2-455b-8446-baad122bc469" />

## Roadmap (Post-Workshop Ideas)

- Receipt OCR (extract amount from receipt)
- Shareable event links with basic backend sync
- Automatic on-chain settlement verification
- Multi-currency and advanced splitting (percentages, weights)

---

## License

Add your preferred license here (e.g., MIT).
