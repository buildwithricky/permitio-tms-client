"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Eye, MoreHorizontal, Search } from "lucide-react"
import { getApprovedRequests } from "@/lib/api"

type TravelRequest = {
  id: string
  employeeName: string
  employeeEmail: string
  destination: string
  purpose: string
  status: "approved"
  createdAt: string
  approvedAt: string
  approvedBy: string
}

export default function ApprovedRequestsPage() {
  const [requests, setRequests] = useState<TravelRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    async function fetchData() {
      try {
       
        const data = await getApprovedRequests()
        setRequests(data)
      } catch (err) {
        setError("Failed to load approved requests")
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
      request.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.employeeEmail.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Approved Travel Requests</CardTitle>
        <CardDescription>View all approved travel requests in the system</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search approved requests..."
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
            {searchQuery ? "No matching approved requests found" : "No approved requests found"}
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Approved Date</TableHead>
                  <TableHead>Approved By</TableHead>
                  <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{request.employeeName}</p>
                        <p className="text-xs text-muted-foreground">{request.employeeEmail}</p>
                      </div>
                    </TableCell>
                    <TableCell>{request.destination}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{request.purpose}</TableCell>
                    <TableCell>{formatDate(request.approvedAt)}</TableCell>
                    <TableCell>{request.approvedBy}</TableCell>
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
                            <Button variant="ghost" className="w-full justify-start">
                              <Eye className="mr-2 h-4 w-4" />
                              <span>View Details</span>
                            </Button>
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
