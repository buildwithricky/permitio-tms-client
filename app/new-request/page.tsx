"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createRequest } from "@/lib/api"

export default function NewRequestPage() {
  const [formData, setFormData] = useState({
    destination: "",
    purpose: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setSuccess(null)

    try {
    
    const response  =  await createRequest(formData)

     if (response) setSuccess("Travel request created successfully!")

      // Reset form
      setFormData({
        destination: "",
        purpose: "",
      })

      // Redirect after a short delay
      setTimeout(() => {
        router.push("/my-requests")
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create request")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Travel Request</CardTitle>
        <CardDescription>Submit a new travel request for approval</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="destination">Destination</Label>
            <Input
              id="destination"
              name="destination"
              placeholder="e.g. New York, London"
              value={formData.destination}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="purpose">Purpose</Label>
            <Textarea
              id="purpose"
              name="purpose"
              placeholder="Describe the purpose of your travel"
              rows={4}
              value={formData.purpose}
              onChange={handleChange}
              required
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => router.push("/my-requests")}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Request"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
