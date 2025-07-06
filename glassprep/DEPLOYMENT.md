# Deploying GlassPrep to Vercel

This guide will help you deploy your GlassPrep application to Vercel.

## Prerequisites

- A GitHub account
- A Vercel account (free tier available)
- Your code pushed to a GitHub repository

## Deployment Steps

### 1. Push to GitHub

Make sure your code is committed and pushed to your GitHub repository:

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 2. Deploy via Vercel Dashboard

1. Go to [Vercel](https://vercel.com) and sign in with your GitHub account
2. Click "New Project"
3. Select your GitHub repository (glassprep)
4. Vercel will automatically detect this is a Vite project
5. Configure the project settings:
   - **Framework Preset**: Vite
   - **Build Command**: `bun run build` (or leave as `npm run build`)
   - **Output Directory**: `dist`
   - **Install Command**: `bun install` (or leave as `npm install`)
6. Click "Deploy"

### 3. Alternative: Deploy via Vercel CLI

If you prefer using the command line:

```bash
# Install Vercel CLI globally
npm i -g vercel

# Deploy from your project directory
vercel

# Follow the prompts to link your project
```

## Configuration Files

The following files have been configured for optimal Vercel deployment:

- **`vercel.json`**: Handles client-side routing and security headers
- **`.vercelignore`**: Excludes unnecessary files from deployment
- **`package.json`**: Contains proper build scripts

## Build Information

- **Build Command**: `bun run build`
- **Output Directory**: `dist`
- **Framework**: Vite + React + TypeScript
- **CSS**: Tailwind CSS
- **Routing**: React Router (SPA)

## Post-Deployment

Once deployed, your app will be available at:
- Production: `https://your-project-name.vercel.app`
- Each branch push will create a preview deployment

## Features Configured

✅ Client-side routing (React Router)  
✅ Security headers (XSS Protection, Frame Options, etc.)  
✅ Asset caching optimization  
✅ TypeScript support  
✅ Tailwind CSS processing  
✅ Responsive design  
✅ Progressive Web App features  

## Troubleshooting

If you encounter issues:

1. **Build Errors**: Check the build logs in Vercel dashboard
2. **Routing Issues**: Ensure `vercel.json` is properly configured
3. **Missing Assets**: Verify all assets are in the `dist` folder after build
4. **Environment Variables**: Add any required env vars in Vercel dashboard

## Custom Domain (Optional)

After deployment, you can add a custom domain:

1. Go to your project settings in Vercel
2. Navigate to "Domains"
3. Add your custom domain
4. Follow the DNS configuration instructions

---

For more information, visit the [Vercel Documentation](https://vercel.com/docs). 