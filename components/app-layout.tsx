"use client"

import type React from "react"

import { useAuth } from "@/lib/auth-context"
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Home, PlaneTakeoff, CheckCircle, LogOut, User, Plus, List } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2 px-4 py-2">
              <PlaneTakeoff className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold">Travel Manager</h1>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/dashboard"}>
                  <Link href="/dashboard">
                    <Home />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/my-requests"}>
                  <Link href="/my-requests">
                    <List />
                    <span>My Requests</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/new-request"}>
                  <Link href="/new-request">
                    <Plus />
                    <span>New Request</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {user?.role === "admin" && (
                <>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname === "/all-requests"}>
                      <Link href="/all-requests">
                        <PlaneTakeoff />
                        <span>All Requests</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname === "/approved-requests"}>
                      <Link href="/approved-requests">
                        <CheckCircle />
                        <span>Approved Requests</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </>
              )}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <div>
                  <p className="text-sm font-medium">
                    {user?.first_name} {user?.last_name}
                  </p>
                  <p className="text-xs text-muted-foreground">{user?.role}</p>
                </div>
              </div>
              <Button variant="outline" className="w-full" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 p-6">
          <div className="container mx-auto">
            <div className="flex items-center mb-6">
              <SidebarTrigger className="mr-4" />
              <h1 className="text-2xl font-bold">{getPageTitle(pathname)}</h1>
            </div>
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}

function getPageTitle(pathname: string): string {
  switch (pathname) {
    case "/dashboard":
      return "Dashboard"
    case "/my-requests":
      return "My Travel Requests"
    case "/new-request":
      return "Create New Request"
    case "/all-requests":
      return "All Travel Requests"
    case "/approved-requests":
      return "Approved Requests"
    default:
      return "Travel Management"
  }
}
