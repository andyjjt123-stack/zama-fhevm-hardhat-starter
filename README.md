# Zama FHEVM Hardhat Starter — FHE Counter

一個「可直接執行」的 FHE 合約範例專案：用 Zama 的 FHEVM 在鏈上對**加密數值**做加總/相減，並由使用者端解密驗證。

## 需求
- Node.js 20+（LTS 建議）
- npm / yarn / pnpm 其一
- （選）Sepolia RPC 與錢包助記詞（部署上線用）

## 安裝
```bash
npm i
```

## 編譯與測試（本地 Hardhat）
```bash
npm run build
npm test
```

測試中會使用 `@fhevm/hardhat-plugin`：
- 透過 `fhevm.createEncryptedInput()` 產生加密輸入
- 交易送進 `FHECounter.increment/decrement(...)`
- 用 `fhevm.userDecryptEuint(...)` 還原驗證

## 部署
1. 複製 `.env.example` 成 `.env`，填入 `SEPOLIA_RPC` 與 `MNEMONIC`
2. 執行：
```bash
npm run deploy:sepolia
```

## 重要文件（官方）
- FHE Counter 範例與測試寫法：https://docs.zama.ai/protocol/examples
- Hardhat 測試與環境：https://docs.zama.ai/protocol/solidity-guides/development-guide/hardhat/write_test
- 快速把普通合約改成 FHE 合約：https://docs.zama.ai/protocol/solidity-guides/getting-started/quick-start-tutorial/turn_it_into_fhevm
- Relayer SDK（前端與合約互動）：https://docs.zama.ai/protocol/relayer-sdk-guides

## 目錄
- `contracts/FHECounter.sol` — 使用 `@fhevm/solidity` 的加密計數器
- `test/FHECounter.ts` — 使用 Hardhat plugin 加密/解密的單元測試
- `scripts/deploy.ts` — 部署腳本
- `hardhat.config.ts` — 已包含 FHEVM plugin 與 Sepolia 設定

---