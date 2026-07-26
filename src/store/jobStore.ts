import { create } from 'zustand'

type JobStore = {
  activeJobId: string | null
  setActiveJobId: (jobId: string) => void
  clearActiveJobId: () => void
  refreshToken: number
  requestJobsRefresh: () => void
}

export const useJobStore = create<JobStore>((set) => ({
  activeJobId: null,
  setActiveJobId: (jobId) => set({ activeJobId: jobId }),
  clearActiveJobId: () => set({ activeJobId: null }),
  refreshToken: 0,
  requestJobsRefresh: () => set((s) => ({ refreshToken: s.refreshToken + 1 }))
}))
