# Deployment Guide for Render

This guide will help you deploy your BBSBEC Digital Notice Board application to [Render](https://render.com).

## Prerequisites

1.  A [Render](https://render.com) account.
2.  Your code pushed to a GitHub or GitLab repository.

## Steps

1.  **Push your code**: Ensure all your local changes (including the new `render.yaml` file) are committed and pushed to your git repository.

2.  **Create a New Blueprint Instance**:
    *   Go to your Render Dashboard.
    *   Click **New +** and select **Blueprint**.
    *   Connect your GitHub/GitLab account if you haven't already.
    *   Select your repository (`bbsbec-digital-notice-board` or similar).

3.  **Configure Services**:
    *   Render will automatically detect the `render.yaml` file and propose 2 services:
        *   `bbsbec-api` (Web Service)
        *   `bbsbec-web` (Static Site)
    *   You will be prompted to provide values for environment variables that are not auto-generated:
        *   `MONGO_URI`: Enter your MongoDB connection string (e.g., from MongoDB Atlas).
    *   `JWT_SECRET` will be auto-generated.
    *   `FRONTEND_URL` and `VITE_API_URL` will be automatically linked.

4.  **Deploy**:
    *   Click **Apply**.
    *   Render will start deploying both services.
    *   Once the deployment is complete, your app will be live!

## Validation

*   Visit the URL provided for `bbsbec-web` to see your frontend.
*   Try logging in or resetting your password to verify the backend connection.

## Troubleshooting

*   **CORS Issues**: If you see CORS errors, check that the backend is running and `server/src/server.js` has `app.use(cors())`.
*   **Database Connection**: Ensure your IP address is whitelisted in MongoDB Atlas (allow 0.0.0.0/0 for Render).
