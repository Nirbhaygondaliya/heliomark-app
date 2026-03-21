// API library for Heliomark backend
import { awsConfig } from './aws-config'
import { getIdToken, refreshTokens, isAuthenticated } from './auth'

const API_BASE = awsConfig.api.baseUrl

// Helper for authenticated API requests
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

// --- Evaluation ---

// Submit single PDF for evaluation
export async function submitEvaluation(file: File): Promise<any> {
  const formData = new FormData()
  formData.append('pdf', file)

  const inst = localStorage.getItem('heliomark_institution')
  if (inst) formData.append('institute_name', inst)

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

// --- Jobs ---

// List all jobs for current user
export async function getJobs(): Promise<any> {
  return await apiRequest('/api/v1/jobs', { method: 'GET' })
}

// Update student name or phone on a job
export async function updateJob(jobId: string, data: {
  studentName?: string
  phoneNo?: string
}): Promise<any> {
  return await apiRequest(`/api/v1/jobs/${jobId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}

// Get fresh download URL for evaluated PDF
export async function getDownloadUrl(jobId: string): Promise<any> {
  return await apiRequest(`/api/v1/jobs/${jobId}/download`, { method: 'GET' })
}

// --- Stats ---

// Get total sheets evaluated + total institutes
export async function getStats(): Promise<any> {
  const response = await fetch(`${API_BASE}/api/v1/stats`)
  return response.json()
}

// --- Profile ---

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
  state?: string
  city?: string
  targetExams?: string
}): Promise<any> {
  return await apiRequest('/api/v1/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}