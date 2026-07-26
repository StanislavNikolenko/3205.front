import { useCallback, useEffect, useState } from 'react'
import { getAllJobs, type Job } from '../api/jobs'
import { useJobStore } from '../store/jobStore'
import { ActiveJobDetails } from './ActiveJobDetails';

export function JobsList() {
  const [jobs, setJobs] = useState<Job[]>([]);

  const handleJobUpdated = useCallback((updated: Job) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === updated.id ? { ...j, ...updated } : j))
    )
  }, []);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const activeJobId = useJobStore((s) => s.activeJobId);
  const setActiveJobId = useJobStore((s) => s.setActiveJobId);
  const clearActiveJobId = useJobStore((s) => s.clearActiveJobId);

  const refreshToken = useJobStore((s) => s.refreshToken);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await getAllJobs();
        if (!cancelled) setJobs(data);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Ошибка загрузки');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [refreshToken]);

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
            <li key={job.id} className={isActive ? 'job-card active' : 'job-card'}>
              <button
                type="button"
                className="job-card__summary"
                onClick={() =>
                    isActive ? clearActiveJobId() : setActiveJobId(job.id)
                  }
              >
                <span>Задание: {job.id}</span>
                <span>Создано: {new Date(job.createdAt).toLocaleString()}</span>
                <span>Статус: {job.status}</span>
                <span>Всего URL: {job.urlCount}</span>
                <span>Успешно: {job.urlSuccessCount}</span>
                <span>Ошибки: {job.urlErrorCount}</span>
              </button>
              {isActive && <ActiveJobDetails onJobUpdated={handleJobUpdated}/>}
            </li>
          )
        })}
      </ul>
    </section>
  );
}