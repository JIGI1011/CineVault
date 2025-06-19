# CineVault

**CineVault** is a movie discovery web app built with **React**, **Firebase**, and the **TMDB API**. It allows users to explore trending movies, manage personal watchlists, rate favourites, and handle account settings securely.

---

## Features

- **Search** for movies by title
- **Browse** popular movies (from TMDB API)
- **Add to Watchlist** (stored in Firebase)
- **Add to Favourites** (stored in Firebase)
- **User Authentication** (Sign Up / Log In via Firebase)
- **Account Deletion** with password confirmation
- Fully **Responsive UI** for desktop & mobile

---

## Tech Stack

- **Frontend:** React (Vite)
- **Backend-as-a-Service:** Firebase (Auth + Firestore)
- **Movie Data:** The Movie Database (TMDB API)
- **Deployment:** Vercel

---

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/cinevault.git
cd cinevault
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory and add the following:

```env
# Firebase
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

# TMDB
VITE_TMDB_API_KEY=your_tmdb_api_key
```

### 4. Start Development Server
```bash
npm run dev
```

---

## Folder Structure
```
src/
├── components/     # Reusable UI components
├── assets/         # Static assets
├── contexts/       # React Context for global state
├── pages/          # Main page components (Home, Watchlist, User)
├── services/       # Firebase and API logic
├── css/            # Custom stylesheets
├── App.jsx         # Main app component and routes
├── main.jsx        # React entry point
├── App.css         # Global styles
├── index.css       # Base styles
```

---

## Notes
- Be sure to keep your `.env` file private.
- TMDB keyword filtering is implemented for content safety.
- Responsive and mobile-friendly layout by default.

---
