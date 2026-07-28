import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  '/api'

function formatDate(value) {
  if (!value) {
    return '-'
  }

  return new Intl.DateTimeFormat(
    'en-US',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }
  ).format(new Date(value))
}

export default function CertificateVerificationPage() {
  const { certificateNumber } =
    useParams()

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState('')

  const [certificate, setCertificate] =
    useState(null)

  useEffect(() => {
    let active = true

    async function verifyCertificate() {
      try {
        setLoading(true)
        setError('')

        const response = await fetch(
          `${API_BASE_URL}/certificates/verify/${encodeURIComponent(
            certificateNumber
          )}`
        )

        const data =
          await response.json()

        if (!response.ok) {
          throw new Error(
            data.message ||
              'Certificate verification failed'
          )
        }

        if (active) {
          setCertificate(
            data.certificate
          )
        }
      } catch (verificationError) {
        if (active) {
          setCertificate(null)
          setError(
            verificationError.message ||
              'Certificate verification failed'
          )
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    if (certificateNumber) {
      verifyCertificate()
    } else {
      setLoading(false)
      setError(
        'Certificate number is missing'
      )
    }

    return () => {
      active = false
    }
  }, [certificateNumber])

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-12">
        <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 text-center shadow-sm">
          <p className="text-slate-600">
            Verifying certificate...
          </p>
        </div>
      </main>
    )
  }

  if (error || !certificate) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-12">
        <div className="mx-auto max-w-3xl rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-2xl text-red-700">
            ×
          </div>

          <h1 className="text-2xl font-bold text-slate-900">
            Certificate Not Verified
          </h1>

          <p className="mt-3 text-slate-600">
            {error ||
              'The certificate could not be verified.'}
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12">
      <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="bg-blue-700 px-6 py-5 text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-100">
            Learning Company
          </p>

          <h1 className="mt-2 text-2xl font-bold">
            Certificate Verification
          </h1>
        </div>

        <div className="p-6 sm:p-8">
          <div className="mb-8 flex items-start gap-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xl font-bold text-white">
              ✓
            </div>

            <div>
              <h2 className="font-semibold text-emerald-900">
                Certificate is valid
              </h2>

              <p className="mt-1 text-sm text-emerald-800">
                This certificate exists in the Learning Company LMS database.
              </p>
            </div>
          </div>

          <dl className="grid gap-5 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-slate-500">
                Recipient
              </dt>
              <dd className="mt-1 text-base font-semibold text-slate-900">
                {certificate.recipient_name}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-slate-500">
                Course
              </dt>
              <dd className="mt-1 text-base font-semibold text-slate-900">
                {certificate.course_title}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-slate-500">
                Training Program
              </dt>
              <dd className="mt-1 text-slate-900">
                {certificate.program_name ||
                  '-'}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-slate-500">
                Trainer
              </dt>
              <dd className="mt-1 text-slate-900">
                {certificate.trainer_name ||
                  '-'}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-slate-500">
                Issue Date
              </dt>
              <dd className="mt-1 text-slate-900">
                {formatDate(
                  certificate.issue_date
                )}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-slate-500">
                Certificate Number
              </dt>
              <dd className="mt-1 break-all font-mono text-sm text-slate-900">
                {
                  certificate.certificate_number
                }
              </dd>
            </div>
          </dl>

          {certificate.file_url && (
            <div className="mt-8 border-t border-slate-200 pt-6">
              <a
                href={
                  certificate.file_url
                }
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white transition hover:bg-blue-800"
              >
                View Certificate PDF
              </a>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
