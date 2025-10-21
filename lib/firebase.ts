import { initializeApp, getApps } from "firebase/app"
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyDEI2A9AtV9PjVXN7WJCoATdbCBHFVcBe8",
  authDomain: "eksul-229ec.firebaseapp.com",
  projectId: "eksul-229ec",
  storageBucket: "eksul-229ec.firebasestorage.app",
  messagingSenderId: "336428655837",
  appId: "1:336428655837:web:d1052473b9b76f910aa734",
  measurementId: "G-4QCD0L2LVC",
}

// Initialize Firebase only if it hasn't been initialized
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]

export const auth = getAuth(app)
export const db = getFirestore(app)

if (typeof window !== "undefined") {
  setPersistence(auth, browserLocalPersistence).catch((error) => {
    console.error("Error setting auth persistence:", error)
  })
}

export default app
