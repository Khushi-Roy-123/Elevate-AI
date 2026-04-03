import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Explanation {
  whatWentWrong: string
  whyItHappened: string
  proTip: string
  commonMistakes: string[]
}

export interface DebugResult {
  explanation: Explanation | null
  fixedCode: string
  diffSummary: string
  simulationHTML: string
  flowchartHTML: string
}

export interface HistoryEntry {
  id: string
  code: string
  error: string
  language: string
  result: DebugResult
  timestamp: string
}

interface AppState {
  code: string
  error: string
  language: string
  loading: boolean
  result: DebugResult | null
  activeTab: 'explain' | 'fixed' | 'simulation' | 'flowchart'
  history: HistoryEntry[]
  isOnline: boolean

  setCode: (code: string) => void
  setError: (error: string) => void
  setLanguage: (lang: string) => void
  setLoading: (v: boolean) => void
  setResult: (r: DebugResult) => void
  setActiveTab: (t: AppState['activeTab']) => void
  addHistory: (entry: HistoryEntry) => void
  clearHistory: () => void
  setOnline: (v: boolean) => void
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      code: `def binary_search(arr, target):
    left, right = 0, len(arr)  # Bug: should be len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1

result = binary_search([1, 3, 5, 7, 9], 7)
print(result)`,
      error: 'IndexError: list index out of range',
      language: 'python',
      loading: false,
      result: null,
      activeTab: 'explain',
      history: [],
      isOnline: true,

      setCode: (code) => set({ code }),
      setError: (error) => set({ error }),
      setLanguage: (language) => set({ language }),
      setLoading: (loading) => set({ loading }),
      setResult: (result) => set({ result }),
      setActiveTab: (activeTab) => set({ activeTab }),
      addHistory: (entry) =>
        set((s) => ({ history: [entry, ...s.history].slice(0, 50) })),
      clearHistory: () => set({ history: [] }),
      setOnline: (isOnline) => set({ isOnline }),
    }),
    { name: 'errorbuddy-store', partialize: (s) => ({ history: s.history }) }
  )
)
