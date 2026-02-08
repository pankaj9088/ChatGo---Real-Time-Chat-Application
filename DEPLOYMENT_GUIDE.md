# 🚀 Deployment Guide for ChatGo

This guide will walk you through deploying your ChatGo MERN stack application. We will deploy the **Backend** to **Render** and the **Frontend** to **Vercel**. Both offer generous free tiers.

## 📋 Prerequisites

1.  **GitHub Account**: You need to push your code to a GitHub repository.
2.  **Render Account**: Sign up at [render.com](https://render.com/).
3.  **Vercel Account**: Sign up at [vercel.com](https://vercel.com/).
4.  **MongoDB Atlas**: You should already have your connection string (URI).
5.  **Cloudinary Account**: You should already have your API keys.

---

## 🛠️ Step 1: Prepare Your Code

1.  **IMPORTANT**: Open `.gitignore` in your project root and **remove** the line `package-lock.json`.
    *   *Why?* Deployment platforms use `package-lock.json` to install the exact versions of dependencies you used during development.
    *   Run `git add .`, `git commit -m "Prepare for deployment"`, and `git push` to update your repository.

2.  **Verify Structure**: Ensure your project has the following structure on GitHub:
    ```
    /backend
      package.json
      server.js
      ...
    /frontend
      package.json
      vite.config.js
      ...
    ```

---

## ☁️ Step 2: Deploy Backend (Render)

1.  **Create New Web Service**:
    *   Go to your Render Dashboard.
    *   Click **New +** -> **Web Service**.
    *   Connect your GitHub repository.

2.  **Configure Service**:
    *   **Name**: `chatgo-backend` (or similar)
    *   **Root Directory**: `backend` (This is crucial since your server is in a subdirectory)
    *   **Environment**: `Node`
    *   **Build Command**: `npm install`
    *   **Start Command**: `npm start`
    *   **Plan**: Free

3.  **Environment Variables**:
    *   Scroll down to "Environment Variables" and add:
        *   `NODE_ENV`: `production`
        *   `MONGODB_URI`: (Your MongoDB Atlas connection string)
        *   `JWT_SECRET`: (A strong, random secret key)
        *   `CLOUDINARY_CLOUD_NAME`: (Your Cloudinary Cloud Name)
        *   `CLOUDINARY_API_KEY`: (Your Cloudinary API Key)
        *   `CLOUDINARY_API_SECRET`: (Your Cloudinary API Secret)
        *   `CLIENT_URL`: **Leave this for now**, we will come back to update it after deploying the frontend.

4.  **Deploy**: Click **Create Web Service**. Wait for the build to finish. Once done, copy the **onrender.com URL** (e.g., `https://chatgo-backend.onrender.com`).

---

## 🌐 Step 3: Deploy Frontend (Vercel)

1.  **Create New Project**:
    *   Go to your Vercel Dashboard.
    *   Click **Add New...** -> **Project**.
    *   Import your GitHub repository.

2.  **Configure Project**:
    *   **Framework Preset**: Vite (should be detected automatically).
    *   **Root Directory**: Click "Edit" and select `frontend`.
    *   **Build Command**: `vite build` (default).
    *   **Output Directory**: `dist` (default).

3.  **Environment Variables**:
    *   Expand "Environment Variables" and add:
        *   `VITE_API_URL`: Paste your **Backend URL** from Step 2 (e.g., `https://chatgo-backend.onrender.com`).
        *   `VITE_SOCKET_URL`: Same as above (e.g., `https://chatgo-backend.onrender.com`).

4.  **Deploy**: Click **Deploy**. Wait for the process to complete. You will get a production URL (e.g., `https://chatgo-frontend.vercel.app`).

---

## 🔗 Step 4: Final Connection

1.  **Update Backend CORS**:
    *   Go back to your **Render Dashboard** -> **Settings** -> **Environment Variables**.
    *   Add/Update `CLIENT_URL` with your **Frontend URL** from Step 3 (e.g., `https://chatgo-frontend.vercel.app`).
    *   Save changes. Render will surely restart your service.

## ✅ Done!

Your ChatGo application should now be live!
- Users can visit your **Frontend URL**.
- The frontend will communicate with your **Backend URL**.
- Images/Videos will be stored in Cloudinary.
- Data will be saved in MongoDB Atlas.
