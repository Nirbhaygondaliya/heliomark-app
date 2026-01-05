// API library for Heliomark backend
import { awsConfig } from './aws-config'
import { getIdToken, refreshTokens, isAuthenticated } from './auth'

const API_BASE = awsConfig.api.baseUrl

// Helper for API requests with authentication
async function apiRequest(
  endpoint: string, 
  options: RequestInit = {}
): Promise<any> {
  // Check authentication
  if (!isAuthenticated()) {
    // Try to refresh tokens
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
    throw new Error(data.error || 'API request failed')
  }

  return data
}

// Health check
export async function healthCheck() {
  const response = await fetch(`${API_BASE}/health`)
  return response.json()
}

// Get presigned URL for file upload
export async function getUploadUrl(fileName: string, fileType: string) {
  return await apiRequest('/upload-url', {
    method: 'POST',
    body: JSON.stringify({ fileName, fileType }),
  })
}

// Upload file to S3 using presigned URL
export async function uploadFileToS3(
  uploadUrl: string, 
  file: File,
  onProgress?: (progress: number) => void
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    
    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable && onProgress) {
        const progress = Math.round((event.loaded / event.total) * 100)
        onProgress(progress)
      }
    })

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(true)
      } else {
        reject(new Error('Upload failed'))
      }
    })

    xhr.addEventListener('error', () => {
      reject(new Error('Upload failed'))
    })

    xhr.open('PUT', uploadUrl)
    xhr.setRequestHeader('Content-Type', file.type)
    xhr.send(file)
  })
}

// Create new evaluation
export async function createEvaluation(params: {
  fileKey: string
  fileName: string
  evaluationType?: string
  prompt?: string
}) {
  return await apiRequest('/evaluations', {
    method: 'POST',
    body: JSON.stringify(params),
  })
}

// Get all evaluations for current user
export async function getEvaluations() {
  return await apiRequest('/evaluations', {
    method: 'GET',
  })
}

// Get single evaluation by ID
export async function getEvaluation(evaluationId: string) {
  return await apiRequest(`/evaluations/${evaluationId}`, {
    method: 'GET',
  })
}

// Complete flow: Upload file and create evaluation
export async function evaluateFile(
  file: File,
  options: {
    evaluationType?: string
    prompt?: string
    onUploadProgress?: (progress: number) => void
  } = {}
) {
  // Step 1: Get presigned URL
  const { uploadUrl, fileKey } = await getUploadUrl(file.name, file.type)
  
  // Step 2: Upload file to S3
  await uploadFileToS3(uploadUrl, file, options.onUploadProgress)
  
  // Step 3: Create evaluation (calls Gemini)
  const evaluation = await createEvaluation({
    fileKey,
    fileName: file.name,
    evaluationType: options.evaluationType,
    prompt: options.prompt,
  })
  
  return evaluation
}
