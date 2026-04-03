import axios from 'axios'
import type { DebugResult } from '../store/useStore'

const BASE = '/api'

export async function explainCode(
  code: string,
  error: string,
  language: string
): Promise<DebugResult> {
  const { data } = await axios.post(`${BASE}/explain`, { code, error, language })
  return data
}

export async function saveHistory(entry: object) {
  await axios.post(`${BASE}/history`, entry).catch(() => {})
}

export async function fetchHistory() {
  const { data } = await axios.get(`${BASE}/history`)
  return data
}
