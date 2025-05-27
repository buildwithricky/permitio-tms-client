// API utility functions for making authenticated travel-requests

import { base_url } from "@/app/constants"

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token")

  if (!token) {
    throw new Error("No authentication token found")
  }

  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  }

  const response = await fetch(`${base_url}${url}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(error || "API request failed")
  }

  return response.json()
}

// Travel request API functions
export async function getMyRequests() {
  return fetchWithAuth("/travel-requests/my")
}

export async function getMyRequestById(id: string) {
  return fetchWithAuth(`/travel-requests/my/${id}`)
}

export async function createRequest(data: { destination: string; purpose: string }) {
  return fetchWithAuth("/travel-requests", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function getAllRequests() {
  return fetchWithAuth("/travel-requests")
}

export async function getApprovedRequests() {
  return fetchWithAuth("/travel-requests/approved")
}

export async function approveRequest(id: string) {
  return fetchWithAuth(`/travel-requests/${id}/approve`, {
    method: "PUT",
  })
}

export async function deleteRequest(id: string) {
  return fetchWithAuth(`/travel-requests/${id}`, {
    method: "DELETE",
  })
}
