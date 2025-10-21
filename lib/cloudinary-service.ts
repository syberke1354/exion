import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
export default cloudinary;

export interface UploadResult {
  url: string
  publicId: string
  secureUrl: string
  format: string
  width?: number
  height?: number
  bytes: number
}

export interface UploadProgress {
  loaded: number
  total: number
  percentage: number
}

export const uploadToCloudinary = async (
  file: File,
  folder: string,
  options?: {
    transformation?: any
    tags?: string[]
    onProgress?: (progress: UploadProgress) => void
  },
): Promise<UploadResult> => {
  return new Promise((resolve, reject) => {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "foto_dokumentasi")
    formData.append("folder", folder)

    if (options?.tags) {
      formData.append("tags", options.tags.join(","))
    }

    const xhr = new XMLHttpRequest()

    // Track upload progress
    if (options?.onProgress) {
      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const progress: UploadProgress = {
            loaded: event.loaded,
            total: event.total,
            percentage: Math.round((event.loaded / event.total) * 100),
          }
          options.onProgress?.(progress)
        }
      })
    }

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const result = JSON.parse(xhr.responseText)
          resolve({
            url: result.url,
            publicId: result.public_id,
            secureUrl: result.secure_url,
            format: result.format,
            width: result.width,
            height: result.height,
            bytes: result.bytes,
          })
        } catch (error) {
          reject(new Error("Failed to parse upload response"))
        }
      } else {
        reject(new Error(`Upload failed: ${xhr.statusText}`))
      }
    })

    xhr.addEventListener("error", () => {
      reject(new Error("Network error during upload"))
    })

    xhr.open("POST", `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`)
    xhr.send(formData)
  })
}

export const uploadMultipleToCloudinary = async (
  files: File[],
  folder: string,
  options?: {
    transformation?: any
    tags?: string[]
    onProgress?: (fileIndex: number, progress: UploadProgress) => void
  },
): Promise<UploadResult[]> => {
  const uploadPromises = files.map((file, index) =>
    uploadToCloudinary(file, folder, {
      ...options,
      onProgress: options?.onProgress ? (progress) => options.onProgress!(index, progress) : undefined,
    }),
  )

  return Promise.all(uploadPromises)
}

export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  try {
    const response = await fetch("/api/cloudinary/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ publicId }),
    })

    if (!response.ok) {
      throw new Error("Failed to delete file from Cloudinary")
    }
  } catch (error) {
    console.error("Error deleting file from Cloudinary:", error)
    throw error
  }
}

export const validateFile = (file: File): { valid: boolean; error?: string } => {
  const maxSize = 10 * 1024 * 1024 // 10MB
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ]

  if (file.size > maxSize) {
    return { valid: false, error: "File size must be less than 10MB" }
  }

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: "Only JPEG, PNG, GIF, WebP, PDF, and Word documents are allowed",
    }
  }

  return { valid: true }
}

// Helper function to get folder for ekstrakurikuler type
export const getFolderForEkskul = (ekskulType: string): string => {
  switch (ekskulType.toLowerCase()) {
    case "robotics":
    case "robotik":
      return "ekskul/robotics"
    case "silat":
    case "pencak silat":
      return "ekskul/silat"
    case "futsal":
      return "ekskul/futsal"
    case "band":
    case "music":
      return "ekskul/music"
    case "hadroh":
      return "ekskul/hadroh"
    case "qori":
      return "ekskul/qori"
    default:
      return "ekskul/documentation"
  }
}
