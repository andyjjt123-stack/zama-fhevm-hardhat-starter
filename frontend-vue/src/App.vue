<template>
  <div style="font-family: ui-sans-serif, system-ui; max-width: 860px; margin: 40px auto; padding: 24px; border: 1px solid #eee; border-radius: 16px;">
    <h1 style="margin: 0 0 12px 0;">🔐 FHE Counter · Vue 最小範例</h1>
    <p style="color:#555;margin:0 0 16px 0;">加密輸入 → 發交易（increment/decrement）→ 使用者端解密顯示結果</p>

    <div style="display:flex; gap:12px; align-items:center; margin-bottom: 12px;">
      <button @click="connect" :disabled="connecting || !!account" style="padding:8px 12px; border-radius: 10px; border:1px solid #ddd; cursor:pointer;">
        {{ account ? '已連接 ' + short(account) : (connecting ? '連接中…' : '連接錢包') }}
      </button>
      <span v-if="chainId">ChainId: {{ chainId }}</span>
    </div>

    <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 8px;">
      <label>Contract Address
        <input v-model="contractAddress" placeholder="0x..." style="width:100%; padding:8px; border:1px solid #ddd; border-radius:8px;"/>
      </label>
      <label>輸入數值（int）
        <input v-model.number="plain" type="number" min="0" style="width:100%; padding:8px; border:1px solid #ddd; border-radius:8px;"/>
      </label>
    </div>

    <div style="display:flex; gap:12px; margin: 8px 0 16px 0;">
      <button @click="doInc" :disabled="!account || !contractAddress || busy" style="padding:8px 12px; border-radius: 10px; border:1px solid #ddd; cursor:pointer;">➕ Increment</button>
      <button @click="doDec" :disabled="!account || !contractAddress || busy" style="padding:8px 12px; border-radius: 10px; border:1px solid #ddd; cursor:pointer;">➖ Decrement</button>
      <button @click="refresh" :disabled="!account || !contractAddress || busy" style="padding:8px 12px; border-radius: 10px; border:1px solid #ddd; cursor:pointer;">🔄 重新整理</button>
    </div>

    <div style="padding:12px; background:#fafafa; border:1px dashed #ddd; border-radius: 12px;">
      <div>🔢 明文輸入： <b>{{ plain }}</b></div>
      <div>🧾 Tx 狀態： <code>{{ status }}</code></div>
      <div>🕵️ 目前鏈上加密值（handle）：<code style="word-break: break-all;">{{ encryptedHandle }}</code></div>
      <div>🗝️ 使用者解密結果：<b>{{ decrypted ?? '—' }}</b></div>
    </div>

    <p style="color:#888; font-size: 13px; margin-top: 14px;">
      提示：請先部署 <code>FHECounter</code>，並確保在合約內呼叫 <code>FHE.allow(_count, msg.sender)</code> 後，使用者可解密。
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { BrowserProvider, Contract } from 'ethers'
import { getFheInstance } from './fhe'
import { FHECOUNTER_ABI } from './abi'

const account = ref<string | null>(null)
const chainId = ref<number | null>(null)
const connecting = ref(false)
const busy = ref(false)
const status = ref('idle')
const contractAddress = ref<string>('')
const plain = ref<number>(1)

const encryptedHandle = ref<string>('')
const decrypted = ref<number | null>(null)

let provider: BrowserProvider | null = null
let fhe: Awaited<ReturnType<typeof getFheInstance>> | null = null

function short(addr: string) { return addr.slice(0, 6) + '…' + addr.slice(-4) }

async function connect() {
  try {
    // @ts-ignore
    if (!window.ethereum) { alert('請先安裝 MetaMask'); return }
    connecting.value = true
    // @ts-ignore
    provider = new BrowserProvider(window.ethereum)
    const accounts = await provider.send('eth_requestAccounts', [])
    account.value = accounts[0]
    const net = await provider.getNetwork()
    chainId.value = Number(net.chainId.toString())
    fhe = await getFheInstance()
  } finally {
    connecting.value = false
  }
}

async function encryptForContract(value: number) {
  if (!fhe || !account.value) throw new Error('fhe instance not ready')
  if (!contractAddress.value) throw new Error('contract address required')
  const buffer = fhe.createEncryptedInput(contractAddress.value, account.value)
  buffer.add32(value)
  const cipher = await buffer.encrypt()
  return cipher
}

async function call(method: 'increment'|'decrement') {
  try {
    if (!provider || !account.value) throw new Error('no wallet')
    if (!contractAddress.value) throw new Error('no contract address')
    busy.value = true
    status.value = 'encrypting…'
    const cipher = await encryptForContract(plain.value || 0)

    const signer = await provider.getSigner()
    const c = new Contract(contractAddress.value, FHECOUNTER_ABI, signer)

    status.value = method + ' sending tx…'
    const tx = await c[method](cipher.handles[0], cipher.inputProof)
    await tx.wait()
    status.value = method + ' confirmed ✔'
    await refresh()
  } catch (err:any) {
    console.error(err)
    status.value = 'error: ' + (err?.message || String(err))
  } finally {
    busy.value = false
  }
}

async function refresh() {
  try {
    if (!provider || !account.value || !contractAddress.value) return
    const signer = await provider.getSigner()
    const c = new Contract(contractAddress.value, FHECOUNTER_ABI, signer)
    const handle: string = await c.getCount()
    encryptedHandle.value = handle || ''

    if (!handle) { decrypted.value = null; return }
    if (!fhe) fhe = await getFheInstance()

    const val = await fhe!.userDecryptEuint('euint32', handle, contractAddress.value, account.value!)
    decrypted.value = Number(val)
    status.value = 'ok'
  } catch (err:any) {
    console.error(err)
    status.value = 'refresh error: ' + (err?.message || String(err))
  }
}

async function doInc() { await call('increment') }
async function doDec() { await call('decrement') }
</script>
