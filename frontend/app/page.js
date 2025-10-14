'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth-provider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield, Users, BarChart3, Lock, Vote, CheckCircle } from 'lucide-react'

export default function HomePage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && user) {
      // Redirect authenticated users to their appropriate dashboard
      switch (user.role) {
        case 'ADMIN':
          router.push('/admin')
          break
        case 'VOTER':
          router.push('/vote')
          break
        default:
          router.push('/vote')
      }
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (user) {
    return null // Will redirect above
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-primary mb-4">SecureVote</h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            A secure, transparent, and efficient digital voting platform built with modern technology
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" onClick={() => router.push('/login')}>
              Sign In
            </Button>
            <Button size="lg" variant="outline" onClick={() => router.push('/register')}>
              Register
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card>
            <CardHeader>
              <Shield className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Secure</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                End-to-end encryption and Spring Security with bcrypt password hashing ensures your vote is protected
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-10 w-10 text-primary mb-2" />
              <CardTitle>User-Friendly</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Intuitive interface makes voting simple and accessible for everyone
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <BarChart3 className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Real-Time Results</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Live updates via WebSockets show poll results as votes are cast
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Lock className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Transparent</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Audit trails and verification ensure the integrity of every vote
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">How It Works</CardTitle>
            <CardDescription>Simple steps to participate in secure digital voting</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  1
                </div>
                <h3 className="font-semibold mb-2">Register & Login</h3>
                <p className="text-sm text-muted-foreground">
                  Create your account with secure authentication
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  2
                </div>
                <h3 className="font-semibold mb-2">Cast Your Vote</h3>
                <p className="text-sm text-muted-foreground">
                  Browse active polls and select your preferred candidate
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  3
                </div>
                <h3 className="font-semibold mb-2">View Results</h3>
                <p className="text-sm text-muted-foreground">
                  See real-time results and analytics instantly
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Technology Stack</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Card className="p-4 min-w-[150px]">
              <p className="font-semibold">Next.js</p>
              <p className="text-sm text-muted-foreground">Frontend</p>
            </Card>
            <Card className="p-4 min-w-[150px]">
              <p className="font-semibold">Spring Boot</p>
              <p className="text-sm text-muted-foreground">Backend</p>
            </Card>
            <Card className="p-4 min-w-[150px]">
              <p className="font-semibold">MySQL</p>
              <p className="text-sm text-muted-foreground">Database</p>
            </Card>
            <Card className="p-4 min-w-[150px]">
              <p className="font-semibold">WebSocket</p>
              <p className="text-sm text-muted-foreground">Real-time</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
