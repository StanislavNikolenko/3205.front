import { useState, type FormEvent } from 'react'
import { createJob } from '../api/jobs'
import { useJobStore } from '../store/jobStore'

export function CreateJobForm() {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const setActiveJobId = useJobStore((s) => s.setActiveJobId);
  const requestJobsRefresh = useJobStore((s) => s.requestJobsRefresh);
  
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const urls = text
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    if (urls.length === 0) return

    setLoading(true);
    try {
      const { jobId } = await createJob(urls);
      setActiveJobId(jobId);
      requestJobsRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="job-form" onSubmit={handleSubmit}>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button type="submit" disabled={loading}>
        Запустить проверку
      </button>
    </form>
  )
}