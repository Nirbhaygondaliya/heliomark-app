// Authentication library using AWS Cognito
import { awsConfig } from './aws-config'

const COGNITO_URL = `https://cognito-idp.${awsConfig.cognito.region}.amazonaws.com/`

// Token storage keys
const TOKEN_KEYS = {
  accessToken: 'heliomark_access_token',
  idToken: 'heliomark_id_token',
  refreshToken: 'heliomark_refresh_token',
}

// Helper to make Cognito API calls
async function cognitoRequest(action: string, params: Record<string, any>) {
  const response = await fetch(COGNITO_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-amz-json-1.1',
      'X-Amz-Target': `AWSCognitoIdentityProviderService.${action}`,
    },
    body: JSON.stringify(params),
  })

  const data = await response.json()
  
  if (!response.ok) {
    throw new Error(data.message || data.__type || 'Authentication failed')
  }
  
  return data
}

// Sign up new user
export async function signUp(email: string, password: string, name?: string, phone?: string) {
  const params: any = {
    ClientId: awsConfig.cognito.clientId,
    Username: email,
    Password: password,
    UserAttributes: [
      { Name: 'email', Value: email },
    ],
  }
  
  if (name) {
    params.UserAttributes.push({ Name: 'name', Value: name })
  }

  if (phone) {
    params.UserAttributes.push({ Name: 'phone_number', Value: phone })
  }

  return await cognitoRequest('SignUp', params)
}

// Confirm sign up with verification code
export async function confirmSignUp(email: string, code: string) {
  return await cognitoRequest('ConfirmSignUp', {
    ClientId: awsConfig.cognito.clientId,
    Username: email,
    ConfirmationCode: code,
  })
}

// Resend confirmation code
export async function resendConfirmationCode(email: string) {
  return await cognitoRequest('ResendConfirmationCode', {
    ClientId: awsConfig.cognito.clientId,
    Username: email,
  })
}

// Sign in with email and password
export async function signIn(email: string, password: string) {
  const response = await cognitoRequest('InitiateAuth', {
    ClientId: awsConfig.cognito.clientId,
    AuthFlow: 'USER_PASSWORD_AUTH',
    AuthParameters: {
      USERNAME: email,
      PASSWORD: password,
    },
  })

  if (response.AuthenticationResult) {
    saveTokens(response.AuthenticationResult)
    return { success: true, user: await getCurrentUser() }
  }

  // Handle challenges (like NEW_PASSWORD_REQUIRED)
  if (response.ChallengeName) {
    return { 
      success: false, 
      challenge: response.ChallengeName,
      session: response.Session 
    }
  }

  throw new Error('Unexpected authentication response')
}

// Sign out
export function signOut() {
  localStorage.removeItem(TOKEN_KEYS.accessToken)
  localStorage.removeItem(TOKEN_KEYS.idToken)
  localStorage.removeItem(TOKEN_KEYS.refreshToken)
}

// Save tokens to localStorage
function saveTokens(authResult: any) {
  if (authResult.AccessToken) {
    localStorage.setItem(TOKEN_KEYS.accessToken, authResult.AccessToken)
  }
  if (authResult.IdToken) {
    localStorage.setItem(TOKEN_KEYS.idToken, authResult.IdToken)
  }
  if (authResult.RefreshToken) {
    localStorage.setItem(TOKEN_KEYS.refreshToken, authResult.RefreshToken)
  }
}

// Get stored access token
export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(TOKEN_KEYS.accessToken)
}

// Get stored ID token
export function getIdToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(TOKEN_KEYS.idToken)
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  const token = getAccessToken()
  if (!token) return false
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.exp * 1000 > Date.now()
  } catch {
    return false
  }
}

// Get current user info from ID token
export function getCurrentUser() {
  const idToken = getIdToken()
  if (!idToken) return null
  
  try {
    const payload = JSON.parse(atob(idToken.split('.')[1]))
    return {
      userId: payload.sub,
      email: payload.email,
      name: payload.name || payload.email,
      phone: payload.phone_number || '',
      emailVerified: payload.email_verified,
    }
  } catch {
    return null
  }
}

// Refresh tokens
export async function refreshTokens() {
  const refreshToken = localStorage.getItem(TOKEN_KEYS.refreshToken)
  if (!refreshToken) {
    throw new Error('No refresh token available')
  }

  const response = await cognitoRequest('InitiateAuth', {
    ClientId: awsConfig.cognito.clientId,
    AuthFlow: 'REFRESH_TOKEN_AUTH',
    AuthParameters: {
      REFRESH_TOKEN: refreshToken,
    },
  })

  if (response.AuthenticationResult) {
    saveTokens(response.AuthenticationResult)
    return true
  }

  return false
}

// Forgot password - initiate reset
export async function forgotPassword(email: string) {
  return await cognitoRequest('ForgotPassword', {
    ClientId: awsConfig.cognito.clientId,
    Username: email,
  })
}

// Forgot password - confirm with code
export async function confirmForgotPassword(email: string, code: string, newPassword: string) {
  return await cognitoRequest('ConfirmForgotPassword', {
    ClientId: awsConfig.cognito.clientId,
    Username: email,
    ConfirmationCode: code,
    Password: newPassword,
  })
}

// Change password (when logged in)
export async function changePassword(oldPassword: string, newPassword: string) {
  const accessToken = getAccessToken()
  if (!accessToken) throw new Error('Not authenticated')

  return await cognitoRequest('ChangePassword', {
    AccessToken: accessToken,
    PreviousPassword: oldPassword,
    ProposedPassword: newPassword,
  })
}
