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
  onSnapshot,
  Timestamp,
  writeBatch,
} from "firebase/firestore"
import { db } from "./firebase"
import type { Member, Schedule, Attendance, Achievement, Documentation, Event, EkskulType } from "../types"

// 🔧 Utility untuk Cloudinary (panggil API route)
async function uploadToCloudinary(file: File, folder: string) {
  const formData = new FormData()
  formData.append("file", file)
  formData.append("folder", folder)

  const res = await fetch("/api/cloudinary/upload", {
    method: "POST",
    body: formData,
  })

  if (!res.ok) throw new Error("Cloudinary upload failed")
  return res.json()
}

async function uploadMultipleToCloudinary(files: File[], folder: string) {
  const uploads = await Promise.all(files.map((f) => uploadToCloudinary(f, folder)))
  return uploads
}

// Utility untuk mapping folder ekskul
function getFolderForEkskul(ekskulType: EkskulType) {
  switch (ekskulType) {
    case "robotik":
      return "ekskul/robotik"
    case "silat":
      return "ekskul/silat"
    case "futsal":
      return "ekskul/futsal"
    case "band":
      return "ekskul/band"
    case "hadroh":
      return "ekskul/hadroh"
    case "qori":
      return "ekskul/qori"
    default:
      return "ekskul/general"
  }
}

// ==========================
// Generic CRUD Service
// ==========================
export class CRUDService<T> {
  constructor(private collectionName: string) {}

async create(data: Omit<T, "id">): Promise<string> {
  const docData: any = { ...data, createdAt: Timestamp.now(), updatedAt: Timestamp.now() }

  // Tambahkan joinDate hanya jika ada
  if ((data as any).joinDate) {
    docData.joinDate =
      (data as any).joinDate instanceof Date
        ? Timestamp.fromDate((data as any).joinDate)
        : new Date((data as any).joinDate)
  }

  const docRef = await addDoc(collection(db, this.collectionName), docData)
  return docRef.id
}

async update(id: string, data: Partial<T>): Promise<void> {
  const docData: any = { ...data, updatedAt: Timestamp.now() }

  if ((data as any).joinDate) {
    docData.joinDate =
      (data as any).joinDate instanceof Date
        ? Timestamp.fromDate((data as any).joinDate)
        : new Date((data as any).joinDate)
  }

  const docRef = doc(db, this.collectionName, id)
  await updateDoc(docRef, docData)
}


  async read(id: string): Promise<T | null> {
    const docRef = doc(db, this.collectionName, id)
    const docSnap = await getDoc(docRef)
    return docSnap.exists() ? ({ id: docSnap.id, ...docSnap.data() } as T) : null
  }


  async delete(id: string): Promise<void> {
    const docRef = doc(db, this.collectionName, id)
    await deleteDoc(docRef)
  }

  async list(filters?: { field: string; operator: any; value: any }[]): Promise<T[]> {
    let q: any = collection(db, this.collectionName)

    if (filters && filters.length > 0) {
      const constraints = filters.map((f) => where(f.field, f.operator, f.value))
      try {
        q = query(q, ...constraints, orderBy("createdAt", "desc"))
      } catch (error) {
        // Fallback without orderBy if there's an index issue
        q = query(q, ...constraints)
      }
    } else {
      try {
        q = query(q, orderBy("createdAt", "desc"))
      } catch (error) {
        // Use collection without orderBy if there's an index issue
        q = collection(db, this.collectionName)
      }
    }

    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => {
      const docData = doc.data() as any
      // Convert Firestore Timestamps to Date objects
      const converted: any = { ...docData }
      
      if (docData.date && typeof docData.date.toDate === 'function') {
        converted.date = docData.date.toDate()
      }
      if (docData.joinDate && typeof docData.joinDate.toDate === 'function') {
        converted.joinDate = docData.joinDate.toDate()
      }
      if (docData.createdAt && typeof docData.createdAt.toDate === 'function') {
        converted.createdAt = docData.createdAt.toDate()
      }
      if (docData.updatedAt && typeof docData.updatedAt.toDate === 'function') {
        converted.updatedAt = docData.updatedAt.toDate()
      }
      
      return { id: doc.id, ...converted }
    }) as T[]
  }

  subscribe(callback: (data: T[]) => void, filters?: { field: string; operator: any; value: any }[]): () => void {
    let q = collection(db, this.collectionName)

    if (filters) {
      const constraints = filters.map((f) => where(f.field, f.operator, f.value))
      try {
        q = query(q, ...constraints, orderBy("createdAt", "desc")) as any
      } catch (error) {
        // Fallback without orderBy if there's an index issue
        q = query(q, ...constraints) as any
      }
    } else {
      try {
        q = query(q, orderBy("createdAt", "desc")) as any
      } catch (error) {
        // Fallback without orderBy if there's an index issue
        q = collection(db, this.collectionName) as any
      }
    }

    return onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => {
        const docData = doc.data()
        // Convert Firestore Timestamps to Date objects
        const converted = { ...docData }
        
     if (docData.joinDate && typeof docData.joinDate.toDate === "function") {
  converted.joinDate = docData.joinDate.toDate()
}
if (docData.createdAt && typeof docData.createdAt.toDate === "function") {
  converted.createdAt = docData.createdAt.toDate()
}
if (docData.updatedAt && typeof docData.updatedAt.toDate === "function") {
  converted.updatedAt = docData.updatedAt.toDate()
}

        
        return { id: doc.id, ...converted }
      }) as T[]
      callback(data)
    })
  }
}

// ==========================
// Service Instances
// ==========================
export const membersService = new CRUDService<Member>("members")
export const schedulesService = new CRUDService<Schedule>("schedules")
export const attendanceService = new CRUDService<Attendance>("attendance")
export const achievementsService = new CRUDService<Achievement>("achievements")
export const documentationService = new CRUDService<Documentation>("documentation")
export const eventsService = new CRUDService<Event>("events")

// ==========================
// Specialized Operations
// ==========================
export const memberOperations = new (class extends CRUDService<Member> {
  constructor() {
    super("members")
  }

  async updateWithPhoto(id: string, data: Partial<Member>, photoFile?: File) {
    const updateData = { ...data }
    if (photoFile) {
      const uploadResult = await uploadToCloudinary(photoFile, "members")
      updateData.photoUrl = uploadResult.secure_url || uploadResult.url
    }
    return this.update(id, updateData)
  }

  async createWithPhoto(data: Omit<Member, "id">, photoFile?: File) {
    const createData = { ...data }
    if (photoFile) {
      const uploadResult = await uploadToCloudinary(photoFile, "members")
      createData.photoUrl = uploadResult.secure_url || uploadResult.url
    }
    return this.create(createData)
  }
})()

export const achievementOperations = new (class extends CRUDService<Achievement> {
  constructor() {
    super("achievements")
  }

  async createWithPhoto(data: Omit<Achievement, "id">, photoFile?: File) {
    const createData = { ...data }
    if (photoFile) {
      const folder = getFolderForEkskul(data.ekskulType)
      const uploadResult = await uploadToCloudinary(photoFile, folder)
      createData.photoUrl = uploadResult.secure_url || uploadResult.url
    }
    return this.create(createData)
  }

  async updateWithPhoto(id: string, data: Partial<Achievement>, photoFile?: File) {
    const updateData = { ...data }
    if (photoFile && data.ekskulType) {
      const folder = getFolderForEkskul(data.ekskulType)
      const uploadResult = await uploadToCloudinary(photoFile, folder)
      updateData.photoUrl = uploadResult.secure_url || uploadResult.url
    }
    return this.update(id, updateData)
  }
})()


export const documentationOperations = new (class extends CRUDService<Documentation> {
  constructor() {
    super("documentation")
  }

  async createWithPhotos(data: Omit<Documentation, "id">, photoFiles: File[]) {
    const folder = getFolderForEkskul(data.ekskulType)
    const uploadResults = await uploadMultipleToCloudinary(photoFiles, folder)
    const photoUrls = uploadResults.map((r) => r.secure_url || r.url)

    return this.create({
      ...data,
      photoUrls,
      image: photoUrls[0] || "",
    })
  }

  async addPhotos(id: string, photoFiles: File[]) {
    const doc = await this.read(id)
    if (!doc) throw new Error("Documentation not found")

    const folder = getFolderForEkskul(doc.ekskulType)
    const uploadResults = await uploadMultipleToCloudinary(photoFiles, folder)
    const newUrls = uploadResults.map((r) => r.secure_url || r.url)
    const updatedPhotoUrls = [...(doc.photoUrls || []), ...newUrls]

    return this.update(id, {
      photoUrls: updatedPhotoUrls,
      image: updatedPhotoUrls[0] || doc.image,
    })
  }
})()


