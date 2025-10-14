'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ProtectedRoute } from '@/components/protected-route'
import { useAuth } from '@/components/auth-provider'
import { pollApi } from '@/lib/api'
import { Plus, LogOut, BarChart3, Users, Vote } from 'lucide-react'
import { formatDateTime } from '@/lib/utils'

export default function AdminPage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [polls, setPolls] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadPolls()
  }, [])

  const loadPolls = async () => {
    try {
      setIsLoading(true)
      const data = await pollApi.getAllPolls()
      setPolls(data)
    } catch (error) {
      console.error('Error loading polls:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    router.push('/login')
  }

  const getStatusBadge = (poll) => {
    if (poll.status === 'ACTIVE') {
      return <Badge variant="default">Active</Badge>
    } else if (poll.status === 'COMPLETED') {
      return <Badge variant="outline">Completed</Badge>
    } else {
      return <Badge variant="secondary">Pending</Badge>
    }
  }

  return (
    <ProtectedRoute requiredRole="ADMIN">
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Users className="h-8 w-8 text-primary" />
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground">Welcome, {user?.name}</p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Total Polls</CardDescription>
                <CardTitle className="text-3xl">{polls.length}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Active Polls</CardDescription>
                <CardTitle className="text-3xl">
                  {polls.filter((p) => p.status === 'ACTIVE').length}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Completed Polls</CardDescription>
                <CardTitle className="text-3xl">
                  {polls.filter((p) => p.status === 'COMPLETED').length}
                </CardTitle>
              </CardHeader>
            </Card>
          </div>

          {/* Actions */}
          <div className="mb-8">
            <Button onClick={() => router.push('/admin/polls/create')}>
              <Plus className="h-4 w-4 mr-2" />
              Create New Poll
            </Button>
          </div>

          {/* Polls List */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">All Polls</h2>
            {isLoading ? (
              <Card>
                <CardContent className="p-8">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                </CardContent>
              </Card>
            ) : polls.length > 0 ? (
              <div className="grid gap-4">
                {polls.map((poll) => (
                  <Card
                    key={poll.id}
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => router.push(`/admin/polls/${poll.id}`)}
                  >
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle>{poll.title}</CardTitle>
                          <CardDescription>{poll.description}</CardDescription>
                        </div>
                        {getStatusBadge(poll)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                        <div>
                          <span className="font-medium">Start:</span> {formatDateTime(poll.startDate)}
                        </div>
                        <div>
                          <span className="font-medium">End:</span> {formatDateTime(poll.endDate)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>No Polls Yet</CardTitle>
                  <CardDescription>Create your first poll to get started.</CardDescription>
                </CardHeader>
              </Card>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
