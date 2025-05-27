"use client"

import { base_url } from "@/app/constants"
import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

type User = {
  id: string
  email: string
  first_name: string
  last_name: string
  role: "admin" | "employee"
  team: string
}

type AuthContextType = {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  signup: (userData: SignupData) => Promise<void>
  logout: () => void
  isLoading: boolean
  error: string | null
}

type SignupData = {
  email: string
  password: string
  first_name: string
  last_name: string
  role: "admin" | "employee"
  team: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check if user is already logged in
    const storedToken = localStorage.getItem("token")
    const storedUser = localStorage.getItem("user")

    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
    }

    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`${base_url}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        throw new Error("Login failed")
      }

      const data = await response.json()

      //Fetch user data and store it in localstorage

      const user =  await fetch(`${base_url}/user/me`,{
        method: "GET",
        headers: {
          "Content-Type": "application/json",
            "Authorization": `Bearer ${data.token}`,
        }})
const userProfile = await user.json()
console.log(userProfile)
      const userData = {
        id:userProfile.user._id,
       ...userProfile.user
      } as User

      setToken(data.token)
      setUser(userData)

      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(userData))
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during login")
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (userData: SignupData) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`${base_url}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        throw new Error("Signup failed")
      }

      // After signup, automatically log in
      await login(userData.email, userData.password)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during signup")
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem("token")
    localStorage.removeItem("user")
  }

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
