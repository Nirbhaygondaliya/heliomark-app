// API library for Heliomark backend
import { awsConfig } from './aws-config'
import { getIdToken, refreshTokens, isAuthenticated } from './auth'

const API_BASE = awsConfig.api.baseUrl

// Helper for API requests with authentication
async function apiRequest(
  endpoint: string, 
  options: RequestInit = {}
): Promise<any> {
  if (!isAuthenticated()) {
    try {
      await refreshTokens()
    } catch {
      throw new Error('Please sign in again')
    }
  }

  const token = getIdToken()
  
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || data.detail || 'API request failed')
  }

  return data
}

// Health check
export async function healthCheck() {
  const response = await fetch(`${API_BASE}/`)
  return response.json()
}

// Get available subjects
export async function getSubjects(): Promise<any> {
  const response = await fetch(`${API_BASE}/api/v1/subjects`)
  return response.json()
}

// Submit PDF for evaluation
export async function submitEvaluation(
  file: File, 
  subjectId: string, 
  onProgress?: (progress: number) => void
): Promise<any> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('subject_id', subjectId)

  // attach institution from localStorage (saved during sign-up/sign-in)
  const inst = localStorage.getItem('heliomark_institution')
  if (inst) formData.append('institution', inst)

  const token = getIdToken()
  const response = await fetch(`${API_BASE}/api/v1/evaluate`, {
    method: 'POST',
    headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    body: formData,
  })

  const data = await response.json()
  if (!response.ok) throw new Error(data.detail || 'Evaluation failed')
  return data
}

// Check job status
export async function getJobStatus(jobId: string): Promise<any> {
  const response = await fetch(`${API_BASE}/api/v1/jobs/${jobId}`)
  return response.json()
}

// Get result PDF download URL
export function getResultPdfUrl(jobId: string): string {
  return `${API_BASE}/api/v1/results/${jobId}/pdf`
}

// --- Evaluation history ---

// Get all evaluations for the current user
export async function getEvaluations(): Promise<any> {
  return await apiRequest('/api/v1/evaluations', { method: 'GET' })
}

// --- Profile endpoints ---

// Get user profile from DynamoDB
export async function getProfile(): Promise<any> {
  return await apiRequest('/api/v1/profile', { method: 'GET' })
}

// Save/update user profile
export async function updateProfile(data: {
  name?: string
  phone?: string
  institution?: string
  location?: string
  role?: string
}): Promise<any> {
  return await apiRequest('/api/v1/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}
