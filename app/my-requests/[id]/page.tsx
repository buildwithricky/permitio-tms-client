"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, MapPin, FileText } from "lucide-react"
import { ProtectedRoute } from "@/components/protected-route"
import { AppLayout } from "@/components/app-layout"
import { getMyRequestById } from "@/lib/api"

type TravelRequest = {
  id: string
  destination: string
  purpose: string
  status: "pending" | "approved" | "rejected"
  createdAt: string
  updatedAt?: string
  approvedAt?: string
  rejectedAt?: string
  approvedBy?: string
  comments?: string
}

export default function RequestDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [request, setRequest] = useState<TravelRequest | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getMyRequestById(id)
        setRequest(data)
      } catch (err) {
        setError("Failed to load request details")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [id])

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="space-y-6">
          <Button variant="outline" className="mb-4" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Requests
          </Button>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-destructive">{error}</div>
          ) : !request ? (
            <div className="text-center py-8 text-muted-foreground">Request not found</div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Travel Request Details</CardTitle>
                  <CardDescription>Request ID: {request.id}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Destination</p>
                      <p className="text-muted-foreground">{request.destination}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Purpose</p>
                      <p className="text-muted-foreground">{request.purpose}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Created At</p>
                      <p className="text-muted-foreground">{formatDate(request.createdAt)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Status</CardTitle>
                    <Badge
                      variant={
                        request.status === "approved"
                          ? "success"
                          : request.status === "rejected"
                            ? "destructive"
                            : "outline"
                      }
                    >
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {request.status === "approved" && (
                    <>
                      <div>
                        <p className="font-medium">Approved By</p>
                        <p className="text-muted-foreground">{request.approvedBy || "N/A"}</p>
                      </div>

                      <div>
                        <p className="font-medium">Approved At</p>
                        <p className="text-muted-foreground">{formatDate(request.approvedAt)}</p>
                      </div>
                    </>
                  )}

                  {request.status === "rejected" && (
                    <div>
                      <p className="font-medium">Rejected At</p>
                      <p className="text-muted-foreground">{formatDate(request.rejectedAt)}</p>
                    </div>
                  )}

                  {request.comments && (
                    <div>
                      <p className="font-medium">Comments</p>
                      <p className="text-muted-foreground">{request.comments}</p>
                    </div>
                  )}

                  <div>
                    <p className="font-medium">Last Updated</p>
                    <p className="text-muted-foreground">{formatDate(request.updatedAt)}</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => router.push("/new-request")}>
                    Create New Request
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}
        </div>
      </AppLayout>
    </ProtectedRoute>
  )
}
