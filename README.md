# 🔐 Zama FHEVM Hardhat Starter + Vue 前端示例  
*(Bilingual 中文 / English)*

---

## 📘 專案簡介 Project Overview

這是一個整合 **Zama FHEVM** 的完整開發範例，展示如何：  
1. 使用 **Hardhat + Solidity** 建立「加密運算（Fully Homomorphic Encryption, FHE）」智慧合約。  
2. 使用 **Vue 3 + @zama-fhe/relayer-sdk** 前端，進行「加密輸入 → 區塊鏈交易 → 使用者端解密」。  

This repository demonstrates how to build and interact with **Zama’s Fully Homomorphic Encryption Virtual Machine (FHEVM)** using both:  
1. **Hardhat (Solidity)** for smart contract development.  
2. **Vue 3 frontend** that encrypts inputs, sends blockchain transactions, and decrypts outputs on the client side.

---

## 🧩 專案結構 Project Structure

```
zama-fhevm-hardhat-starter/
├── contracts/           # Solidity contracts (FHECounter)
├── test/                # Hardhat + FHEVM Plugin unit tests
├── scripts/             # Deployment scripts (deploy.ts)
├── frontend-vue/        # Minimal Vue 3 frontend using @zama-fhe/relayer-sdk
├── hardhat.config.ts    # Hardhat configuration (includes FHEVM plugin)
├── package.json         # Backend dependencies
├── README.md            # (You are here)
└── .env.example         # Sample environment variables
```

---

## ⚙️ 系統需求 Requirements

| Component | Version |
|------------|----------|
| Node.js | ≥ 18 (LTS) |
| npm | ≥ 9 |
| Hardhat | 2.22+ |
| Vue | 3.x |
| TypeScript | 5.x |

---

## 🧱 安裝與啟動 Installation & Quick Start

### 🧭 1. Hardhat 後端 (Smart Contract)

```bash
npm install
npm run build
npm test
```

> 測試使用 `@fhevm/hardhat-plugin`：自動建立加密輸入、執行交易、解密驗證。

### 🚀 2. 部署到 Sepolia 測試網 (Deploy to Sepolia)

```bash
cp .env.example .env
# 編輯 .env，填入 SEPOLIA_RPC 與 MNEMONIC
npm run deploy:sepolia
```

---

### 🖥️ 3. Vue 前端 (Frontend-Vue)

```bash
cd frontend-vue
npm install
cp .env.example .env
npm run dev
```

打開 [http://localhost:5173](http://localhost:5173) 後可：  
- 連接錢包 → 貼上合約地址 → 輸入數值 → 點 Increment / Decrement  
- 顯示鏈上加密值與本地解密結果。

---

## 🔄 FHE 運作流程 FHE Execution Flow

```
[使用者前端 Vue]
   ↓
加密輸入 (createEncryptedInput + encrypt)
   ↓
呼叫智慧合約 (increment/decrement)
   ↓
[區塊鏈 FHEVM]
   → 驗證 proof
   → 運算 euint32 數值
   → 更新加密狀態
   ↓
[使用者端]
   ← 取得加密值 handle
   ← userDecryptEuint 解密回明文
```

| 階段 Stage | 模組 Module | 功能 Function |
|-------------|-------------|----------------|
| Encryption | @zama-fhe/relayer-sdk | 前端加密輸入與生成證明 |
| Verification | FHE.fromExternal | 智慧合約驗證證明 |
| Computation | FHE.add / sub | 加密狀態下進行運算 |
| Decryption | userDecryptEuint | 使用者端解密結果 |

---

## 🧪 測試與驗證 Testing & Verification

測試檔 `test/FHECounter.ts` 驗證完整流程：  
- 加密輸入 → 呼叫 increment → 讀取 getCount → 使用者解密。  
- 驗證計數器從 0 → 1 → 0。

---

## 🏗️ 關鍵元件 Key Components

| 模組 | 說明 Description |
|------|------------------|
| `@fhevm/solidity` | 提供 FHE 資料型別（euint32）與運算函式 |
| `@fhevm/hardhat-plugin` | 測試階段自動加密/解密支援 |
| `@zama-fhe/relayer-sdk` | 前端 SDK 用於加密、驗證、解密 |
| `SepoliaConfig` | 自動設定 Sepolia FHEVM 測試網環境 |

---

## 🌐 環境變數 Environment Variables

`.env.example` 內已填入 Sepolia 測試網預設：  
```bash
VITE_RELAYER_URL=https://relayer.testnet.zama.cloud
VITE_ACL_CONTRACT=0x687820221192C5B662b25367F70076A37bc79b6c
```

請至 Zama 官方文件確認最新設定：  
🔗 https://docs.zama.ai/

---

## 🌟 English Summary

This repo is a complete example showing how to:  
- Build an FHE-enabled smart contract with Hardhat.  
- Interact from Vue frontend via encrypted input / local decryption.  
- Use Zama’s Relayer SDK on Sepolia testnet.  

**Highlights:**  
- End-to-end FHE workflow (Encrypt → Compute → Decrypt).  
- Vue interface ready for custom integration.  
- Designed for developers exploring Zama FHEVM.

---
