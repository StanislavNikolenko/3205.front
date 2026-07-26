import { useEffect, useState } from 'react'
import { getAllJobs, type Job } from '../api/jobs'
import { useJobStore } from '../store/jobStore'

export function JobsList() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const activeJobId = useJobStore((s) => s.activeJobId)
  const setActiveJobId = useJobStore((s) => s.setActiveJobId)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const data = await getAllJobs()
        if (!cancelled) setJobs(data)
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Ошибка загрузки')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  if (loading) return <p>Загрузка заданий…</p>
  if (error) return <p role="alert">{error}</p>
  if (jobs.length === 0) return <p>Заданий пока нет</p>

  return (
    <section className="jobs-list">
      <h2>Последние задания</h2>
      <ul>
        {jobs.map((job) => {
          const isActive = job.id === activeJobId
          return (
            <li key={job.id}>
              <button
                type="button"
                className={isActive ? 'job-item active' : 'job-item'}
                onClick={() => setActiveJobId(job.id)}
              >
                <span>Задание: {job.id}</span>
                <span>Создано: {new Date(job.createdAt).toLocaleString()}</span>
                <span>Статус: {job.status}</span>
                <span>Всего URL: {job.urlCount}</span>
                <span>Успешно: {job.urlSuccessCount}</span>
                <span>Ошибки: {job.urlErrorCount}</span>
                {isActive && <span> ← active</span>}
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}