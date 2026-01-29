
# 🚀 Code Crackers – Competitive Programming Platform

**Code Crackers** is a modern, secure, and real-time competitive programming platform built with **Next.js 16**.  
It features a professional in-browser IDE, real-time code execution, and a sophisticated Admin **“Watchtower”** for monitoring anti-cheat telemetry during contests.

---

## 🌟 Key Features

### 👨‍💻 For Participants

- **Secure Authentication**  
  Seamless login via Google (Firebase Authentication).

- **Modern Dashboard**  
  Track problems solved, current score, and rank in real time.

- **Professional IDE**
  - Built-in **Monaco Editor** (VS Code–like experience)
  - Split-view interface (Problem Statement ↔ Code Editor)
  - **Run Code**: Test against example cases instantly
  - **Submit Code**: Evaluated against hidden test cases

- **Multi-Language Support**
  - Python
  - C++
  - Java
  - JavaScript
  - C

- **Profile History**
  - View past submissions
  - Code history
  - Verdicts and scores

---

### 🛡️ For Administrators – *The Watchtower*

- **Live Telemetry**
  - Real-time monitoring of user activity during contests

- **Anti-Cheat Detection**
  - Tab switch detection
  - Paste detection (flags large code pastes)
  - **Suspicion Radar** with auto-calculated *Sus Score*

- **Content Management**
  - Create, edit, and delete problems
  - Manage the problem library

- **Contest Control**
  - Freeze / Unfreeze contest instantly
  - Export leaderboard as **Excel / CSV**

- **User Management**
  - Instantly disqualify (ban) users from the dashboard

---

## 🛠️ Tech Stack

| Category        | Technologies |
|-----------------|--------------|
| Framework       | Next.js 16 (App Router), React 19 |
| Styling         | Tailwind CSS, Lucide Icons |
| Database        | Firebase Firestore (NoSQL) |
| Authentication | Firebase Authentication (Google Provider) |
| Code Execution | Piston API (Remote Code Execution Engine) |
| Editor          | @monaco-editor/react |
| Utilities       | XLSX (Excel Export), clsx |

---

## ⚡ Getting Started

Follow these steps to set up the project locally.

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/pugazh342/code-crackers.git
cd code-crackers
````

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Configure Firebase

1. Go to the **Firebase Console**
2. Create a new project
3. Enable **Authentication → Google Provider**
4. Create **Firestore Database** (start in Test Mode)
5. Copy your project configuration keys

### 4️⃣ Set Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 5️⃣ Run the Development Server

```bash
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🔐 Admin Configuration (Important)

The Admin Panel is protected by a strict **email allowlist**.

1. Open:

   ```
   src/app/admin/layout.tsx
   ```
2. Locate the `ADMIN_EMAILS` array:

```ts
const ADMIN_EMAILS = ["your.actual.email@gmail.com"];
```

3. Add your Google email address
4. Navigate to:

   ```
   /admin
   ```

---

## 📂 Project Structure

```bash
src/
├── app/
│   ├── (dashboard)/        # User routes (Protected)
│   │   ├── dashboard/      # User stats
│   │   ├── problems/       # Problem list & IDE
│   │   └── profile/        # User submission history
│   ├── admin/              # Admin routes (Restricted)
│   │   ├── add-problem/    # Create new challenges
│   │   ├── problems/       # Manage/Delete problems
│   │   ├── users/          # Export results & Ban users
│   │   └── page.tsx        # "Watchtower" Dashboard
│   ├── api/                # Backend API routes
│   │   ├── run/            # Test code (Piston)
│   │   └── submit/         # Grade code & Save to DB
│   └── login/              # Login page
├── components/             # Shared UI components
├── context/                # AuthContext (User state)
└── lib/                    # Firebase configuration
```

---

## 🧪 How Code Execution Works

### ▶️ Run Code

* Triggered when the user clicks **Run**
* Code is sent to `/api/run`
* Executed via **Piston API** using example test cases
* **No score is recorded**

### 📤 Submit Code

* Triggered when the user clicks **Submit**
* Code is sent to `/api/submit`
* Hidden test cases are fetched from Firestore
* Output is validated and score is updated in the database

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the project
2. Create your feature branch

   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. Commit your changes

   ```bash
   git commit -m "Add some AmazingFeature"
   ```
4. Push to the branch

   ```bash
   git push origin feature/AmazingFeature
   ```
5. Open a Pull Request

---

## 📄 License

This project is open-source and available under the **MIT License**.

---
``` bash
Made with 💻 & ☕ by Pugazhmani.K
Powered by CyberWolf

```

