const API_URL = import.meta.env.VITE_API_URL

export type CreateJobResponse = {
  jobId: string;
  status: string;
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