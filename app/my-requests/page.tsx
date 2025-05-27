"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Eye, MoreHorizontal, Search } from "lucide-react"
import Link from "next/link"
import { getMyRequests } from "@/lib/api"

type TravelRequest = {
  _id: string
  destination: string
  purpose: string
  status: "pending" | "approved" | "rejected"
  createdAt: string
}

export default function MyRequestsPage() {
  const [requests, setRequests] = useState<TravelRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    async function fetchData() {
      try {
      const data = await getMyRequests()
        setRequests(data)
      } catch (err) {
        setError("Failed to load requests")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredRequests = requests.filter(
    (request) =>
      request.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.purpose.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>My Travel Requests</CardTitle>
            <CardDescription>View and manage your travel requests</CardDescription>
          </div>
          <Button asChild>
            <Link href="/new-request">Create New Request</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search requests..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-destructive">{error}</div>
        ) : filteredRequests.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {searchQuery ? "No matching requests found" : "No requests found"}
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Destination</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.destination}</TableCell>
                    <TableCell>{request.purpose}</TableCell>
                    <TableCell>{formatDate(request.createdAt)}</TableCell>
                    <TableCell>
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
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/my-requests/${request._id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              <span>View Details</span>
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
