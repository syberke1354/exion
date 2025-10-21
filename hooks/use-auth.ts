"use client"

import { useState, useEffect } from "react"
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, type User as FirebaseUser } from "firebase/auth"
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import type { User } from "@/types"

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        try {
          // Get user data from Firestore
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid))
          if (userDoc.exists()) {
            const userData = userDoc.data()
            setUser({
              id: firebaseUser.uid,
              email: firebaseUser.email || userData.email,
              ...userData,
            } as User)
          } else {
            // Create user document if it doesn't exist
            const newUserData = {
              email: firebaseUser.email,
              name: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "Admin",
              role: "super_admin", // Default role
              createdAt: new Date(),
              updatedAt: new Date(),
            }
            await setDoc(doc(db, "users", firebaseUser.uid), newUserData)
            setUser({ id: firebaseUser.uid, ...newUserData } as User)
          }
        } catch (error) {
          console.error("Error fetching user data:", error)
          setUser(null)
        }
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      return { success: true, user: userCredential.user }
    } catch (error: any) {
      let errorMessage = "Login gagal"

      switch (error.code) {
        case "auth/user-not-found":
          errorMessage = "Email tidak terdaftar"
          break
        case "auth/wrong-password":
          errorMessage = "Password salah"
          break
        case "auth/invalid-email":
          errorMessage = "Format email tidak valid"
          break
        case "auth/too-many-requests":
          errorMessage = "Terlalu banyak percobaan login. Coba lagi nanti"
          break
        default:
          errorMessage = error.message || "Terjadi kesalahan saat login"
      }

      return { success: false, error: errorMessage }
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  const updateProfile = async (data: Partial<User>) => {
    if (!user) throw new Error("No user logged in")

    try {
      await updateDoc(doc(db, "users", user.id), {
        ...data,
        updatedAt: new Date(),
      })

      setUser((prev) => (prev ? { ...prev, ...data } : null))
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  return {
    user,
    loading,
    login,
    logout,
    updateProfile,
  }
}
