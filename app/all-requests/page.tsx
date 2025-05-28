"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Eye, MoreHorizontal, Search, Trash2, Filter } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { approveRequest, deleteRequest, getAllRequests } from "@/lib/api"

type TravelRequest = {
  _id: string,
  user_id:{
    first_name:string,
    email:string
  },
  destination: string
  purpose: string
  status: "pending" | "approved" | "rejected"
  createdAt: string
}

export default function AllRequestsPage() {
  const [requests, setRequests] = useState<TravelRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    async function fetchData() {
      try {
     
        const data = await getAllRequests()
        console.log(data)
      
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

  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.user_id.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.user_id.email.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || request.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const handleApprove = async (id: string) => {
    setIsProcessing(true)
    try {
 
    await approveRequest(id)
      setRequests((prevRequests) => prevRequests.map((req) => (req._id === id ? { ...req, status: "approved" } : req)))
    } catch (err) {
      setError("Failed to approve request")
      console.error(err)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return

    setIsProcessing(true)
    try {
      await deleteRequest(deleteId)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      // Update local state
      setRequests((prevRequests) => prevRequests.filter((req) => req._id !== deleteId))
    } catch (err) {
      setError("Failed to delete request")
      console.error(err)
    } finally {
      setIsProcessing(false)
      setDeleteId(null)
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>All Travel Requests</CardTitle>
          <CardDescription>View and manage all travel requests in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by destination, employee, or purpose..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
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
              {searchQuery || statusFilter !== "all" ? "No matching requests found" : "No requests found"}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Destination</TableHead>
                    <TableHead>Purpose</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.map((request) => (
                    <TableRow key={request._id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{request.user_id?.first_name}</p>
                          <p className="text-xs text-muted-foreground">{request.user_id?.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>{request.destination}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{request.purpose}</TableCell>
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
                            <Button variant="ghost" className="h-8 w-8 p-0" disabled={isProcessing}>
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

                            {request.status === "pending" && (
                              <DropdownMenuItem asChild>
                                <Button
                                  variant="ghost"
                                  className="w-full justify-start"
                                  onClick={() => handleApprove(request._id)}
                                  disabled={isProcessing}
                                >
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  <span>Approve</span>
                                </Button>
                              </DropdownMenuItem>
                            )}

                            <DropdownMenuItem asChild>
                              <Button
                                variant="ghost"
                                className="w-full justify-start text-destructive"
                                onClick={() => setDeleteId(request._id)}
                                disabled={isProcessing}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>Delete</span>
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

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the travel request.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isProcessing}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isProcessing ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
