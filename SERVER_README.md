# AutoPrep Flask Server Deployment Guide

This document provides instructions for deploying the AutoPrep Flask server to Render.com.

## Files for Deployment

- `server_commented.py`: Main Flask server file
- `student_agent.py`: Student AI agent implementation
- `exam_practice_agent.py`: Exam practice AI agent implementation
- `notes_generator_agent.py`: Notes generator AI agent implementation
- `requirements.txt`: Python dependencies
- `Procfile`: Instructions for Render.com on how to run the application

## Deployment Steps for Render.com

Follow these steps to deploy your Flask server to Render.com:

1. **Create a Render.com Account**
   - Sign up at [render.com](https://render.com) if you don't already have an account

2. **Prepare Your Repository**
   - Make sure your code is in a Git repository (GitHub, GitLab, or Bitbucket)
   - Ensure all the necessary files are committed:
     - Flask server files (server_commented.py and agent files)
     - requirements.txt
     - Procfile

3. **Create a New Web Service on Render**
   - Log in to your Render dashboard
   - Click "New" and select "Web Service"
   - Connect your Git repository
   - Select the repository containing your Flask server

4. **Configure the Web Service**
   - Name: `autoprep-api` (or your preferred name)
   - Environment: `Python 3`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn server_commented:app`
   - Select the appropriate plan (Free tier is available for testing)

5. **Set Environment Variables**
   - In the Render dashboard, go to your web service
   - Click on "Environment" tab
   - Add the following environment variables:
     - `OPENAI_API_KEY`: Your OpenAI API key
     - `SUPABASE_URL`: Your Supabase URL
     - `SUPABASE_KEY`: Your Supabase key
     - `FRONTEND_URL`: Your frontend URL (e.g., https://autoprep.vercel.app)
     - `ENVIRONMENT`: Set to `production`
     - Any other API keys or configuration values your application needs

6. **Deploy the Service**
   - Click "Create Web Service"
   - Render will automatically build and deploy your application
   - The deployment process may take a few minutes

7. **Update Your Next.js Application**
   - Once deployed, Render will provide you with a URL for your API
   - Update your Next.js application to use this new API URL
   - In your frontend code, replace any references to your local API with the new Render URL

## Connecting Your Next.js App to the Deployed API

Update your Next.js application to use the Render.com API URL:

```typescript
// Example of updating API URL in your Next.js app
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://your-render-app-name.onrender.com';

// Example API call
async function fetchFromAPI(endpoint, data) {
  const response = await fetch(`${API_URL}/${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    credentials: 'include',
  });
  return await response.json();
}
```

## Troubleshooting

- **CORS Issues**: Ensure your Flask server's CORS configuration includes your frontend URL
- **Environment Variables**: Double-check that all required environment variables are set correctly
- **Logs**: Check the logs in your Render dashboard for any errors
- **Cold Starts**: The free tier of Render may have cold starts, which can cause initial requests to be slow

## Maintenance

- **Scaling**: If you need more resources, you can upgrade your Render plan
- **Monitoring**: Use the Render dashboard to monitor your application's performance
- **Updates**: To update your application, simply push changes to your Git repository
