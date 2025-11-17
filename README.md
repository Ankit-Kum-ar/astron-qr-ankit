# 🔗 Dynamic QR Code Management System

A full-stack Next.js application for creating, managing, and tracking dynamic QR codes with admin authentication, MongoDB persistence, and real-time analytics.

**Live Demo:** 🚀 [https://astron-qr-ankit.vercel.app](https://astron-qr-ankit.vercel.app)

---

## ✨ Features

### 🏠 Public Features
- **Free QR Code Generator** - Generate static QR codes from any text/URL
- **Download as PNG** - Download generated QR codes locally
- **Admin Panel Access** - Easy button to access admin features

### 🔐 Admin Features (Authentication Required)
- **Create Dynamic QR Codes** - Generate QR codes that redirect to custom URLs
- **QR Code Dashboard** - View all created QR codes with live preview
- **Manage URLs** - Update destination URLs without changing QR image
- **Analytics** - Track scan counts and last scan timestamps
- **Short URL Sharing** - Generate short links for easy sharing

### 🔄 Core Functionality
- **Dynamic Redirects** - `/q/[shortCode]` endpoint redirects to destination URL
- **Scan Tracking** - Automatic counter increment on each redirect
- **Admin Auth** - NextAuth with Google OAuth integration
- **MongoDB Storage** - QR codes stored with base64 image data
- **Flexible Access Control** - All authenticated users are admins (configurable)

---

## 🛠️ Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Framework** | Next.js (App Router) | 16.0.3 |
| **Runtime** | Node.js + Turbopack | Latest |
| **Frontend** | React + TypeScript | 19.2.0 |
| **Styling** | Tailwind CSS + Radix UI | v4 |
| **Auth** | NextAuth v5 (Beta) | 5.0.0-beta.30 |
| **Database** | MongoDB Atlas | Cloud |
| **QR Generation** | qrcode library | 1.5.4 |
| **Data Storage** | Mongoose | 8.20.0 |
| **ID Generation** | nanoid | 5.1.6 |
| **Deployment** | Vercel | Production |

---

## 📋 Prerequisites

Before you begin, ensure you have:
- **Node.js** 18+ and npm/yarn installed
- **MongoDB Atlas** account (free tier available)
- **Google Cloud Console** project with OAuth 2.0 credentials
- **Git** for version control
- **Vercel account** (optional, for deployment)

---

## 🚀 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/Ankit-Kum-ar/qr.git
cd qr
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Configure Environment Variables

Create `.env.local` file in root directory with:

```dotenv
# NextAuth Configuration
AUTH_SECRET="generate-a-random-secret-with-openssl-rand-base64-32"
AUTH_GOOGLE_ID="your-google-oauth-client-id"
AUTH_GOOGLE_SECRET="your-google-oauth-client-secret"

# Admin Configuration
# Leave empty to allow all authenticated users as admins
# Or add comma-separated emails: admin1@example.com,admin2@example.com
ADMIN_EMAILS=""

# MongoDB Configuration
MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority&appName=qr"

# Application URLs
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
AUTH_URL="http://localhost:3000"
```

### 4. Setup Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create new OAuth 2.0 Credential (Web Application)
3. Add Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
   - `http://localhost:3000/auth/signin`
4. Copy Client ID and Client Secret to `.env.local`

### 5. Setup MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster
3. Create database user with password
4. Whitelist your IP address
5. Get connection string: `mongodb+srv://user:password@cluster.mongodb.net/?retryWrites=true&w=majority`
6. Add to `.env.local` as `MONGODB_URI`

### 6. Generate AUTH_SECRET

```bash
# macOS/Linux
openssl rand -base64 32

# Windows PowerShell
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes([guid]::NewGuid().ToString()))
```

---

## 🏃 Running Locally

### Development Mode

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Features:
- ✅ Hot-reload on file changes
- ✅ Live error reporting
- ✅ MongoDB connection logs
- ✅ TypeScript checking

### Production Build

```bash
npm run build
npm start
```

---

## 📱 Usage Guide

### 1. Generate Static QR Code (Public)

1. Visit home page
2. Enter text or URL
3. Click "Generate QR"
4. Click "Download PNG" to save

### 2. Create Dynamic QR Code (Admin)

1. Click "Admin Panel" button
2. Sign in with any Google account
3. Click "Create QR Code"
4. Enter destination URL
5. Click "Generate QR Code"
6. Get short code and short URL

**Example Response:**
```
Short Code: ABC123
Short URL: https://astron-qr-ankit.vercel.app/q/ABC123
Destination: https://example.com
```

### 3. View All QR Codes (Admin)

1. Go to Admin Dashboard (`/admin`)
2. See table with all QR codes
3. View scan count and creation date
4. Click "Manage" to edit

### 4. Update QR Code (Admin)

1. Click "Manage" on any QR code
2. See current QR image (doesn't change)
3. Update destination URL
4. Click "Update Destination URL"
5. Changes apply immediately

### 5. Use QR Code

- **Scan:** Use any QR scanner
- **Click:** Visit short URL
- **Result:** Redirected to destination URL
- **Tracking:** Scan count increments automatically

---

## 📡 API Routes

### Public Endpoints

#### GET `/q/[shortCode]`
Redirect endpoint with scan tracking
- **Params:** `shortCode` (e.g., ABC123)
- **Response:** 307 redirect to destination URL
- **Side Effects:** Increments scan counter

**Example:**
```bash
GET https://astron-qr-ankit.vercel.app/q/ABC123
# → Redirects to destination URL
# → Increments scan count
```

### Admin Endpoints (Authentication Required)

#### POST `/api/links`
Create new QR code
```bash
curl -X POST https://astron-qr-ankit.vercel.app/api/links \
  -H "Content-Type: application/json" \
  -d '{"destinationUrl":"https://example.com"}'
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "shortCode": "ABC123",
    "shortUrl": "https://astron-qr-ankit.vercel.app/q/ABC123",
    "destinationUrl": "https://example.com",
    "qrImageUrl": "data:image/png;base64,..."
  }
}
```

#### GET `/api/links`
List all QR codes with pagination
```bash
curl https://astron-qr-ankit.vercel.app/api/links?page=1&limit=10
```

#### GET `/api/links/[code]`
Fetch specific QR code
```bash
curl https://astron-qr-ankit.vercel.app/api/links/ABC123
```

#### PATCH `/api/links/[code]`
Update QR code destination URL
```bash
curl -X PATCH https://astron-qr-ankit.vercel.app/api/links/ABC123 \
  -H "Content-Type: application/json" \
  -d '{"destinationUrl":"https://new-url.com"}'
```

---

## 🌍 Environment Variables Reference

### Required Variables

| Variable | Purpose | Example |
|----------|---------|---------|
| `AUTH_SECRET` | NextAuth encryption key | Random 32-char string |
| `AUTH_GOOGLE_ID` | Google OAuth Client ID | From Google Cloud Console |
| `AUTH_GOOGLE_SECRET` | Google OAuth Client Secret | From Google Cloud Console |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `NEXT_PUBLIC_BASE_URL` | Application URL (public) | `http://localhost:3000` |

### Optional Variables

| Variable | Purpose | Default | Example |
|----------|---------|---------|---------|
| `AUTH_URL` | NextAuth URL override | Same as `NEXT_PUBLIC_BASE_URL` | `http://localhost:3000` |
| `ADMIN_EMAILS` | Admin email whitelist | Empty (all authenticated users are admins) | `admin@example.com` |

### Development vs Production

**Development (.env.local):**
```dotenv
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
AUTH_URL="http://localhost:3000"
MONGODB_URI="mongodb+srv://..."
```

**Production (Vercel):**
```dotenv
NEXT_PUBLIC_BASE_URL="https://astron-qr-ankit.vercel.app"
AUTH_URL="https://astron-qr-ankit.vercel.app"
MONGODB_URI="mongodb+srv://..." # Same as dev
```

---

## 🚀 Deployment to Vercel

### 1. Push to GitHub

```bash
git add .
git commit -m "Ready for deployment"
git push origin master
```

### 2. Connect to Vercel

1. Go to [Vercel Dashboard](https://vercel.com)
2. Click "New Project"
3. Import GitHub repository
4. Select root directory

### 3. Configure Environment Variables

In Vercel project settings → Environment Variables, add:

```
AUTH_SECRET = (same as local)
AUTH_GOOGLE_ID = (same as local)
AUTH_GOOGLE_SECRET = (same as local)
MONGODB_URI = (same as local)
NEXT_PUBLIC_BASE_URL = https://your-vercel-domain.vercel.app
AUTH_URL = https://your-vercel-domain.vercel.app
ADMIN_EMAILS = (leave empty or add emails)
```

### 4. Update Google OAuth

In Google Cloud Console OAuth settings, add:

**Authorized redirect URIs:**
- `https://your-vercel-domain.vercel.app/api/auth/callback/google`
- `https://your-vercel-domain.vercel.app/auth/signin`

**Authorized JavaScript origins:**
- `https://your-vercel-domain.vercel.app`

### 5. Deploy

```bash
# Automatic: Push to GitHub and Vercel will auto-deploy
# Or manually: Click "Deploy" in Vercel dashboard
```

### 6. Test Production

1. Visit your Vercel URL
2. Create a QR code through admin panel
3. Test redirect at `/q/[shortCode]`

---

## 📁 Project Structure

```
qr/
├── app/
│   ├── page.tsx                      # Home - Free QR Generator
│   ├── layout.tsx                    # Root layout with SessionProvider
│   ├── globals.css                   # Global styles
│   ├── admin/
│   │   ├── page.tsx                  # Admin dashboard
│   │   ├── create/
│   │   │   └── page.tsx              # Create QR page
│   │   └── layout.tsx                # Protected layout
│   ├── manage/
│   │   └── [code]/
│   │       └── page.tsx              # Edit QR page
│   ├── q/
│   │   └── [shortCode]/
│   │       └── route.ts              # Redirect endpoint
│   └── api/
│       ├── qr/
│       │   └── create/
│       │       └── route.ts          # Legacy QR creation
│       ├── links/
│       │   ├── route.ts              # POST (create), GET (list)
│       │   └── [code]/
│       │       └── route.ts          # GET, PATCH (fetch, update)
│       └── auth/
│           └── [...]                 # NextAuth routes
├── components/
│   ├── create-qr-form.tsx            # QR creation form
│   ├── ui/                           # Radix UI components
│   └── ...
├── lib/
│   ├── db.ts                         # MongoDB connection
│   ├── models/
│   │   └── qrcode.ts                 # QR schema
│   ├── admin.ts                      # Auth utilities
│   ├── qr-generator.ts               # QR generation
│   ├── s3-upload.ts                  # MongoDB storage
│   └── qr-utils.ts                   # Helpers
├── types/
│   └── next-auth.d.ts                # NextAuth types
├── auth.ts                           # NextAuth config
├── middleware.ts                     # Auth middleware
├── next.config.ts                    # Next.js config
├── tsconfig.json                     # TypeScript config
├── tailwind.config.ts                # Tailwind config
├── vercel.json                       # Vercel config
├── .env.local                        # Environment variables
├── package.json                      # Dependencies
└── README.md                         # This file
```

---

## 🔒 Security Features

✅ **Authentication:** NextAuth v5 with Google OAuth  
✅ **Authorization:** Admin role-based access control  
✅ **Input Validation:** URL validation on frontend & backend  
✅ **Database Security:** MongoDB Atlas with network security  
✅ **HTTPS:** Enforced on production (Vercel)  
✅ **Secrets:** Environment variables never exposed  
✅ **Session Management:** Secure JWT tokens with NextAuth  

---

## 🐛 Troubleshooting

### MongoDB Connection Timeout

**Problem:** `Operation timed out after 10000ms`

**Solution:**
1. Check MONGODB_URI in .env.local
2. Verify IP address is whitelisted in MongoDB Atlas
3. Check network connectivity

### 404 on `/q/[code]` Routes

**Problem:** Short URLs return 404 on Vercel

**Solution:**
1. Check `vercel.json` rewrites exclude `/q/`, `/admin/`, `/manage/`
2. Verify NEXT_PUBLIC_BASE_URL matches Vercel domain
3. Redeploy after fixing

### Google OAuth Redirect Error

**Problem:** `Redirect URI mismatch`

**Solution:**
1. Check Google Cloud Console OAuth settings
2. Add exact redirect URIs (with trailing slash if needed)
3. Match production domain exactly

### QR Code Not Showing in Admin

**Problem:** Empty table in admin dashboard

**Solution:**
1. Create a QR code via `/admin/create`
2. Wait 2-3 seconds for MongoDB to save
3. Refresh dashboard page
4. Check browser console for errors

---

## 📊 Database Schema

### QRCode Collection

```json
{
  "_id": ObjectId,
  "shortCode": "ABC123",              // Unique, indexed
  "destinationUrl": "https://...",    // Validated URL
  "qrImageBase64": "iVBORw0KG...",   // Base64 PNG data
  "qrImageUrl": "data:image/png;...", // Data URL for display
  "shortUrl": "https://.../q/ABC123", // Full short URL
  "scans": 0,                         // Increment on each visit
  "lastScannedAt": null,              // Updated on each visit
  "createdAt": ISODate,               // Auto
  "updatedAt": ISODate                // Auto
}
```

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] Create static QR code and download
- [ ] Sign in to admin panel
- [ ] Create dynamic QR code
- [ ] View QR code in dashboard
- [ ] Click "Manage" and update destination URL
- [ ] Test short URL redirect
- [ ] Verify scan count increments
- [ ] Test on Vercel production

### Test Account

Use any Google account to sign in during development (all are admins when `ADMIN_EMAILS=""`)

---

## 📚 Additional Documentation

- [API Implementation Details](./API_IMPLEMENTATION.md)
- [MongoDB Storage Guide](./MONGODB_STORAGE.md)
- [Admin Authentication](./ADMIN_AUTH.md)
- [Project Architecture](./ARCHITECTURE.md)

---

## 📞 Support & Questions

For issues or questions:
1. Check troubleshooting section above
2. Review documentation files
3. Check browser console for errors
4. Verify environment variables are set correctly

---

## 📄 License

This project is open source and available under the MIT License.

---

## ✅ Deployment Checklist

Before going live:

- [ ] All environment variables configured in Vercel
- [ ] Google OAuth credentials added to Google Cloud Console
- [ ] MongoDB Atlas IP whitelist updated
- [ ] `NEXT_PUBLIC_BASE_URL` set to production domain
- [ ] `vercel.json` rewrites configured correctly
- [ ] Test QR code creation on production
- [ ] Test QR redirect on production
- [ ] Check scan tracking works
- [ ] Verify admin authentication works

---

**Live Application:** 🚀 [https://astron-qr-ankit.vercel.app](https://astron-qr-ankit.vercel.app)

**Repository:** 📦 [GitHub](https://github.com/Ankit-Kum-ar/qr)

---

Built with ❤️ using Next.js, MongoDB, and Vercel
