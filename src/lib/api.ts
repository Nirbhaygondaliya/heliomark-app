// API library for Heliomark backend
import { getIdToken, refreshTokens, isAuthenticated } from './auth'

// EC2 backend URL
const EC2_API = process.env.NEXT_PUBLIC_EC2_API_URL || 'https://api.heliomark.ai'

// Helper for EC2 API requests
async function ec2Request(
  endpoint: string,
  options: RequestInit = {}
): Promise<any> {
  const response = await fetch(`${EC2_API}${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
    },
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.detail || data.error || 'API request failed')
  }

  return data
}

// Health check
export async function healthCheck() {
  return await ec2Request('/')
}

// Get available subjects/boards for dropdowns
export async function getSubjects() {
  return await ec2Request('/api/v1/subjects')
}

// Submit PDF for evaluation
export async function submitEvaluation(
  file: File,
  subjectId: string = 'upsc-mains-gs2',
  onUploadProgress?: (progress: number) => void
): Promise<{ job_id: string; status: string; estimated_minutes: number }> {
  return new Promise((resolve, reject) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('subject_id', subjectId)

    const xhr = new XMLHttpRequest()

    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable && onUploadProgress) {
        const progress = Math.round((event.loaded / event.total) * 100)
        onUploadProgress(progress)
      }
    })

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.responseText))
      } else {
        try {
          const err = JSON.parse(xhr.responseText)
          reject(new Error(err.detail || 'Upload failed'))
        } catch {
          reject(new Error('Upload failed'))
        }
      }
    })

    xhr.addEventListener('error', () => {
      reject(new Error('Network error — could not reach server'))
    })

    xhr.open('POST', `${EC2_API}/api/v1/evaluate`)
    xhr.send(formData)
  })
}

// Check job status
export async function getJobStatus(jobId: string) {
  return await ec2Request(`/api/v1/jobs/${jobId}`)
}

// Get evaluation result
export async function getResult(jobId: string) {
  return await ec2Request(`/api/v1/results/${jobId}`)
}

// Get PDF download URL
export function getResultPdfUrl(jobId: string): string {
  return `${EC2_API}/api/v1/results/${jobId}/pdf`
}

// Get configs for a subject
export async function getConfigs(subjectId: string = 'upsc-mains-gs2') {
  return await ec2Request(`/api/v1/configs/${subjectId}`)
}

// Legacy
export async function evaluateFile(
  file: File,
  options: {
    evaluationType?: string
    prompt?: string
    onUploadProgress?: (progress: number) => void
  } = {}
) {
  const { job_id } = await submitEvaluation(file, 'upsc-mains-gs2', options.onUploadProgress)
  return { job_id }
}

export async function getEvaluations() {
  return []
}
