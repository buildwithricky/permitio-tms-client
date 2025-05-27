import type React from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { AppLayout } from "@/components/app-layout"

export default function NewRequestLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <AppLayout>{children}</AppLayout>
    </ProtectedRoute>
  )
}
