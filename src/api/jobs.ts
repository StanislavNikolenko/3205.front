const API_URL = import.meta.env.VITE_API_URL

export type CreateJobResponse = {
  jobId: string;
  status: string;
}

export type Job = {
  id: string,
  status: string,
  createdAt: string,
  urlCount: number,
  urlSuccessCount: number,
  urlErrorCount: number,
}

export async function createJob(urls: string[]): Promise<CreateJobResponse> {
  const res = await fetch(`${API_URL}/api/jobs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ urls }),
  })

  if (!res.ok) {
    throw new Error(`Failed to create job: ${res.status}`)
  }

  return res.json()
}

export async function getAllJobs(): Promise<Job[]> {
    const res = await fetch(`${API_URL}/api/jobs`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
  
    if (!res.ok) {
      throw new Error(`Failed to get jobs: ${res.status}`)
    }
  
    return res.json();
}
