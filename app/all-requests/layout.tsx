import type React from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { AppLayout } from "@/components/app-layout"

export default function AllRequestsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <AppLayout>{children}</AppLayout>
    </ProtectedRoute>
  )
}
