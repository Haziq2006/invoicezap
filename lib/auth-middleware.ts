import { NextRequest } from 'next/server'
import { supabase } from './supabase'

export interface AuthenticatedRequest {
  user: {
    id: string
    email: string | undefined
  }
}

export async function authenticateRequest(request: NextRequest): Promise<AuthenticatedRequest | { error: string, status: number }> {
  try {
    // Get user from Supabase session
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return { error: 'Missing or invalid authorization header', status: 401 }
    }

    const token = authHeader.split(' ')[1]
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return { error: 'Unauthorized', status: 401 }
    }

    return {
      user: {
        id: user.id,
        email: user.email
      }
    }
  } catch (error) {
    console.error('Authentication error:', error)
    return { error: 'Internal server error', status: 500 }
  }
}

export function isAuthError(result: AuthenticatedRequest | { error: string, status: number }): result is { error: string, status: number } {
  return 'error' in result
}
