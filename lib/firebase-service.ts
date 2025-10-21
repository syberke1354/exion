import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore"
import { db } from "./firebase"
import type { Member, Documentation, Achievement, Attendance, Schedule } from "@/types"

// Helper function to convert Firestore data
const convertFirestoreData = (data: any) => {
  const converted = { ...data }
  
  // Convert Firestore Timestamps to Date objects
  if (data.date && typeof data.date.toDate === 'function') {
    converted.date = data.date.toDate()
  } else if (data.date && typeof data.date === 'string') {
    converted.date = new Date(data.date)
  }
  
  if (data.joinDate && typeof data.joinDate.toDate === 'function') {
    converted.joinDate = data.joinDate.toDate()
  } else if (data.joinDate && typeof data.joinDate === 'string') {
    converted.joinDate = new Date(data.joinDate)
  }
  
  if (data.createdAt && typeof data.createdAt.toDate === 'function') {
    converted.createdAt = data.createdAt.toDate()
  }
  
  if (data.updatedAt && typeof data.updatedAt.toDate === 'function') {
    converted.updatedAt = data.updatedAt.toDate()
  }
  
  return converted
}

// Members
export const addMember = async (member: Omit<Member, "id" | "createdAt" | "updatedAt">) => {
  const docRef = await addDoc(collection(db, "members"), {
    ...member,
    joinDate: member.joinDate instanceof Date ? Timestamp.fromDate(member.joinDate) : Timestamp.fromDate(new Date(member.joinDate)),
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  })
  return docRef.id
}

export const updateMember = async (id: string, updates: Partial<Member>) => {
  const docRef = doc(db, "members", id)
  await updateDoc(docRef, {
    ...updates,
    updatedAt: Timestamp.now(),
  })
}

export const deleteMember = async (id: string) => {
  await deleteDoc(doc(db, "members", id))
}

export const getMembers = async (ekskulType?: string) => {
  let q = query(collection(db, "members"), orderBy("createdAt", "desc"))

  if (ekskulType) {
    q = query(collection(db, "members"), where("ekskulType", "==", ekskulType), orderBy("createdAt", "desc"))
  }

  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({ 
    id: doc.id, 
    ...convertFirestoreData(doc.data()) 
  }) as Member)
}

// Documentation
export const addDocumentation = async (doc: Omit<Documentation, "id" | "createdAt" | "updatedAt">) => {
  const docRef = await addDoc(collection(db, "documentation"), {
    ...doc,
    date: doc.date instanceof Date ? Timestamp.fromDate(doc.date) : Timestamp.fromDate(new Date(doc.date)),
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  })
  return docRef.id
}

export const updateDocumentation = async (id: string, updates: Partial<Documentation>) => {
  const docRef = doc(db, "documentation", id)
  await updateDoc(docRef, {
    ...updates,
    updatedAt: Timestamp.now(),
  })
}

export const deleteDocumentation = async (id: string) => {
  await deleteDoc(doc(db, "documentation", id))
}

export const getDocumentation = async (ekskulType?: string) => {
  let q = query(collection(db, "documentation"), orderBy("createdAt", "desc"))

  if (ekskulType) {
    q = query(collection(db, "documentation"), where("ekskulType", "==", ekskulType), orderBy("createdAt", "desc"))
  }

  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({ 
    id: doc.id, 
    ...convertFirestoreData(doc.data()) 
  }) as Documentation)
}

export const addAchievement = async (achievement: Omit<Achievement, "id" | "createdAt" | "updatedAt">) => {
  const docRef = await addDoc(collection(db, "achievements"), {
    ...achievement,
    date: achievement.date instanceof Date ? Timestamp.fromDate(achievement.date) : Timestamp.fromDate(new Date(achievement.date)),
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  })
  return docRef.id
}

export const updateAchievement = async (id: string, updates: Partial<Achievement>) => {
  const docRef = doc(db, "achievements", id)
  await updateDoc(docRef, {
    ...updates,
    updatedAt: Timestamp.now(),
  })
}

export const deleteAchievement = async (id: string) => {
  await deleteDoc(doc(db, "achievements", id))
}

export const getAchievements = async (ekskulType?: string) => {
  let q = query(collection(db, "achievements"), orderBy("createdAt", "desc"))

  if (ekskulType) {
    q = query(collection(db, "achievements"), where("ekskulType", "==", ekskulType), orderBy("createdAt", "desc"))
  }

  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({ 
    id: doc.id, 
    ...convertFirestoreData(doc.data()) 
  }) as Achievement)
}

export const addAttendance = async (attendance: Omit<Attendance, "id" | "createdAt">) => {
  const docRef = await addDoc(collection(db, "attendance"), {
    ...attendance,
    createdAt: Timestamp.now(),
  })
  return docRef.id
}

export const updateAttendance = async (id: string, updates: Partial<Attendance>) => {
  const docRef = doc(db, "attendance", id)
  await updateDoc(docRef, updates)
}

export const deleteAttendance = async (id: string) => {
  await deleteDoc(doc(db, "attendance", id))
}

export const getAttendance = async (ekskulType?: string, memberId?: string) => {
  let q = query(collection(db, "attendance"), orderBy("createdAt", "desc"))

  if (ekskulType && memberId) {
    q = query(
      collection(db, "attendance"),
      where("ekskulType", "==", ekskulType),
      where("memberId", "==", memberId),
      orderBy("createdAt", "desc"),
    )
  } else if (ekskulType) {
    q = query(collection(db, "attendance"), where("ekskulType", "==", ekskulType), orderBy("createdAt", "desc"))
  }

  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({ 
    id: doc.id, 
    ...convertFirestoreData(doc.data()) 
  }) as Attendance)
}

export const addSchedule = async (schedule: Omit<Schedule, "id" | "createdAt" | "updatedAt">) => {
  const docRef = await addDoc(collection(db, "schedules"), {
    ...schedule,
    date: typeof schedule.date === 'string' ? Timestamp.fromDate(new Date(schedule.date)) : Timestamp.fromDate(schedule.date),
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  })
  return docRef.id
}

export const updateSchedule = async (id: string, updates: Partial<Schedule>) => {
  const docRef = doc(db, "schedules", id)
  await updateDoc(docRef, {
    ...updates,
    updatedAt: Timestamp.now(),
  })
}

export const deleteSchedule = async (id: string) => {
  await deleteDoc(doc(db, "schedules", id))
}

export const getSchedules = async (ekskulType?: string) => {
  let q = query(collection(db, "schedules"), orderBy("date", "asc"))

  if (ekskulType) {
    q = query(collection(db, "schedules"), where("ekskulType", "==", ekskulType), orderBy("date", "asc"))
  }

  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({ 
    id: doc.id, 
    ...convertFirestoreData(doc.data()) 
  }) as Schedule)
}

export const getMemberById = async (id: string): Promise<Member | null> => {
  try {
    const docSnap = await getDoc(doc(db, "members", id))
    if (docSnap.exists()) {
      return { 
        id: docSnap.id, 
        ...convertFirestoreData(docSnap.data()) 
      } as Member
    }
    return null
  } catch (error) {
    console.error("Error getting member:", error)
    return null
  }
}

export const getActiveMembers = async (ekskulType?: string) => {
  let q = query(collection(db, "members"), where("status", "==", "active"), orderBy("createdAt", "desc"))

  if (ekskulType) {
    q = query(
      collection(db, "members"),
      where("ekskulType", "==", ekskulType),
      where("status", "==", "active"),
      orderBy("createdAt", "desc"),
    )
  }

  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({ 
    id: doc.id, 
    ...convertFirestoreData(doc.data()) 
  }) as Member)
}

export const getRecentDocumentation = async (ekskulType?: string, limit = 10) => {
  let q = query(collection(db, "documentation"), orderBy("createdAt", "desc"))

  if (ekskulType) {
    q = query(collection(db, "documentation"), where("ekskulType", "==", ekskulType), orderBy("createdAt", "desc"))
  }

  const snapshot = await getDocs(q)
  const docs = snapshot.docs.map((doc) => ({ 
    id: doc.id, 
    ...convertFirestoreData(doc.data()) 
  }) as Documentation)
  return docs.slice(0, limit)
}
