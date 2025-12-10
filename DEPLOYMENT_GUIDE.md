# Deployment Guide for Render

This guide will help you deploy your BBSBEC Digital Notice Board application to [Render](https://render.com).

## Prerequisites

1.  A [Render](https://render.com) account.
2.  Your code pushed to a GitHub or GitLab repository.

## Steps to Deploy

1.  **Push your code**: Ensure all your local changes (including the new `render.yaml` file) are committed and pushed to your git repository.

2.  **Create a New Blueprint Instance (Recommended)**:
    *   Go to your Render Dashboard.
    *   Click **New +** and select **Blueprint**.
    *   Connect your GitHub account.
    *   Select your repository (`bbsbec-digital-notice-board`).
    *   Render will read the `render.yaml` file and set up everything automatically.
    *   **Environment Variables**: You will be asked for `MONGO_URI`. Enter your MongoDB connection string.

3.  **Manual Setup (If not using Blueprint)**:
    *   **Backend Service**: Create a Web Service for `server` directory. Command: `npm start`.
    *   **Frontend Service**: Create a Static Site for root directory. Build Command: `npm run build`. Publish directory: `dist`.
    *   **IMPORTANT**: You MUST connect them using an environment variable.
        1.  Copy the **Backend URL** (e.g., `https://bbsbec-api.onrender.com`).
        2.  Go to **Frontend Service** > **Environment**.
        3.  Add Key: `VITE_API_URL`, Value: `https://bbsbec-api.onrender.com` (Your actual backend URL).
        4.  Redeploy the Frontend.

## Troubleshooting "Failed to Fetch" on Phone

If your website opens but shows "Failed to fetch" or "Network Error" when logging in:

**Reason**: The Frontend doesn't know where the Backend is, so it's trying to connect to `localhost`. `localhost` only works on your own laptop.

**Solution**:
1.  Go to your **Render Dashboard**.
2.  Click on your **Backend Service** (`bbsbec-api`) and copy the URL (top left, starts with `https://`).
3.  Click on your **Frontend Service** (`bbsbec-web`).
4.  Go to **Environment** tab.
5.  Add a new Variable:
    *   **Key**: `VITE_API_URL`
    *   **Value**: (Paste the Backend URL you copied)
6.  Click **Save Changes**.
7.  Click **Deploy** > **Redeploy**.

Once redeployed, the Frontend will know to talk to the Backend on the internet.
