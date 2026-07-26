import { create } from 'zustand'

type JobStore = {
  activeJobId: string | null
  setActiveJobId: (jobId: string) => void
  clearActiveJobId: () => void
}

export const useJobStore = create<JobStore>((set) => ({
  activeJobId: null,
  setActiveJobId: (jobId) => set({ activeJobId: jobId }),
  clearActiveJobId: () => set({ activeJobId: null }),
}))