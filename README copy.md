# EXION - Ekstrakurikuler Management System

Sistem manajemen ekstrakurikuler modern untuk SMK TI BAZMA yang memungkinkan pengelolaan data anggota, dokumentasi kegiatan, prestasi, dan jadwal secara terintegrasi.

## Fitur Utama

### 🎯 Dashboard Admin
- **Super Admin**: Kelola seluruh sistem dan admin ekstrakurikuler
- **Admin Ekstrakurikuler**: Kelola data spesifik per ekstrakurikuler
- **Manajemen Anggota**: CRUD anggota dengan foto dan jabatan
- **Dokumentasi Kegiatan**: Upload foto dan deskripsi kegiatan
- **Manajemen Prestasi**: Catat prestasi dan penghargaan
- **Sistem Absensi**: Tracking kehadiran anggota
- **Jadwal Kegiatan**: Manajemen jadwal latihan dan event

### 🌐 Website Publik
- **Homepage**: Showcase ekstrakurikuler dan prestasi
- **Halaman Ekstrakurikuler**: Detail setiap ekstrakurikuler
- **Galeri Prestasi**: Tampilan prestasi dan penghargaan
- **Kontak**: Informasi kontak dan lokasi sekolah

### 🔐 Sistem Autentikasi
- Login admin dengan role-based access
- Keamanan data dengan Firebase Authentication
- Session management yang aman

## Ekstrakurikuler yang Didukung

1. **Robotik** - Teknologi dan Programming
2. **Pencak Silat** - Bela Diri Tradisional
3. **Futsal** - Olahraga Tim
4. **Band/Musik** - Seni Musik
5. **Hadroh** - Seni Musik Islami
6. **Qori** - Tilawah Al-Quran

## Teknologi yang Digunakan

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, Shadcn/UI
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **File Upload**: Cloudinary
- **Animations**: Framer Motion

## Akun Admin Default

```
Super Admin: admin@smktibazma.sch.id / admin123456
Robotik: robotik@smktibazma.sch.id / robotik123
Silat: silat@smktibazma.sch.id / silat123
Futsal: futsal@smktibazma.sch.id / futsal123
Band: band@smktibazma.sch.id / band123
Hadroh: hadroh@smktibazma.sch.id / hadroh123
Qori: qori@smktibazma.sch.id / qori123
```

## Instalasi dan Setup

1. Clone repository
2. Install dependencies: `npm install`
3. Setup environment variables
4. Run development server: `npm run dev`
5. Create admin accounts: `node scripts/create-admin-accounts.js`

## Environment Variables

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Struktur Project

```
├── app/                    # Next.js App Router
├── components/            # React Components
│   ├── ui/               # Shadcn/UI Components
│   ├── admin-*/          # Admin Dashboard Components
│   └── *-page.tsx        # Page Components
├── lib/                  # Utilities & Services
├── hooks/                # Custom React Hooks
├── types/                # TypeScript Types
└── scripts/              # Setup Scripts
```

## Kontribusi

Dikembangkan oleh:
- Mirza Bakti S.Kom
- Qiageng Berke Jaisyurrohman
- Danish Athaya Natasurendra
- Ahmad Fairuz Ghaly Faisol

## Lisensi

© 2025 SMK TI BAZMA. All rights reserved.