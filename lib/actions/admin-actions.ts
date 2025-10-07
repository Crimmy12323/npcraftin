"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

// Helper function to check if user is authenticated
async function checkAuth() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized: You must be logged in to perform this action")
  }

  return { supabase, user }
}

// Executor actions
export async function createExecutor(formData: FormData) {
  const { supabase } = await checkAuth()

  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const imageUrl = formData.get("imageUrl") as string
  const accessType = formData.get("accessType") as string

  const { error } = await supabase.from("executors").insert({
    name,
    description,
    image_url: imageUrl,
    access_type: accessType,
  })

  if (error) {
    throw new Error(`Failed to create executor: ${error.message}`)
  }

  revalidatePath("/executors")
  return { success: true }
}

export async function updateExecutor(id: number, formData: FormData) {
  const { supabase } = await checkAuth()

  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const imageUrl = formData.get("imageUrl") as string
  const accessType = formData.get("accessType") as string

  const { error } = await supabase
    .from("executors")
    .update({
      name,
      description,
      image_url: imageUrl,
      access_type: accessType,
    })
    .eq("id", id)

  if (error) {
    throw new Error(`Failed to update executor: ${error.message}`)
  }

  revalidatePath("/executors")
  return { success: true }
}

export async function deleteExecutor(id: number) {
  const { supabase } = await checkAuth()

  const { error } = await supabase.from("executors").delete().eq("id", id)

  if (error) {
    throw new Error(`Failed to delete executor: ${error.message}`)
  }

  revalidatePath("/executors")
  return { success: true }
}

// Script actions
export async function createScript(formData: FormData) {
  const { supabase } = await checkAuth()

  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const imageUrl = formData.get("imageUrl") as string
  const accessType = formData.get("accessType") as string

  const { error } = await supabase.from("scripts").insert({
    name,
    description,
    image_url: imageUrl,
    access_type: accessType,
  })

  if (error) {
    throw new Error(`Failed to create script: ${error.message}`)
  }

  revalidatePath("/scripts")
  return { success: true }
}

export async function updateScript(id: number, formData: FormData) {
  const { supabase } = await checkAuth()

  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const imageUrl = formData.get("imageUrl") as string
  const accessType = formData.get("accessType") as string

  const { error } = await supabase
    .from("scripts")
    .update({
      name,
      description,
      image_url: imageUrl,
      access_type: accessType,
    })
    .eq("id", id)

  if (error) {
    throw new Error(`Failed to update script: ${error.message}`)
  }

  revalidatePath("/scripts")
  return { success: true }
}

export async function deleteScript(id: number) {
  const { supabase } = await checkAuth()

  const { error } = await supabase.from("scripts").delete().eq("id", id)

  if (error) {
    throw new Error(`Failed to delete script: ${error.message}`)
  }

  revalidatePath("/scripts")
  return { success: true }
}
