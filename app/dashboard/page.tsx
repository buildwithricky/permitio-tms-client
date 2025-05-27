"use client"

import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlaneTakeoff, CheckCircle, Clock, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { getAllRequests, getMyRequests } from "@/lib/api"

type TravelRequest = {
  id: string
  destination: string
  purpose: string
  status: "pending" | "approved" | "rejected"
  createdAt: string
}

export default function Dashboard() {
  const { user } = useAuth()
  const [requests, setRequests] = useState<TravelRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const data = user?.role === "admin" ? await getAllRequests() : await getMyRequests()
        setRequests(data)
      } catch (err) {
        setError("Failed to load requests")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [user])

  const pendingCount = requests.filter((req) => req.status === "pending").length
  const approvedCount = requests.filter((req) => req.status === "approved").length
  const rejectedCount = requests.filter((req) => req.status === "rejected").length

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <PlaneTakeoff className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{requests.length}</div>
            <p className="text-xs text-muted-foreground">All travel requests</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedCount}</div>
            <p className="text-xs text-muted-foreground">Ready for travel</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rejectedCount}</div>
            <p className="text-xs text-muted-foreground">Not approved</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Requests</CardTitle>
            <CardDescription>Your most recent travel requests</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <div className="text-center py-4 text-destructive">{error}</div>
            ) : requests.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">No requests found</div>
            ) : (
              <div className="space-y-4">
                {requests.slice(0, 3).map((request) => (
                  <div key={request.id} className="flex items-center justify-between border-b pb-2">
                    <div>
                      <p className="font-medium">{request.destination}</p>
                      <p className="text-sm text-muted-foreground">{request.purpose}</p>
                    </div>
                    <div className="flex items-center">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          request.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : request.status === "rejected"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-4">
              <Button asChild variant="outline" className="w-full">
                <Link href="/my-requests">View All Requests</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks you can perform</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild className="w-full">
              <Link href="/new-request">
                <PlaneTakeoff className="mr-2 h-4 w-4" />
                Create New Travel Request
              </Link>
            </Button>

            {user?.role === "admin" && (
              <Button asChild variant="outline" className="w-full">
                <Link href="/all-requests">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Review Pending Requests
                </Link>
              </Button>
            )}

            <Button asChild variant="outline" className="w-full">
              <Link href="/my-requests">
                <Clock className="mr-2 h-4 w-4" />
                Check Request Status
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
