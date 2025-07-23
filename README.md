# Python Evaluation App

This React application allows users to write and validate Python code with automatic environment detection for local development and production deployment.

## Environment Configuration

The app automatically detects the environment and uses appropriate API endpoints:

- **Local Development**: Calls Python API directly at `http://4.188.74.28:4000/api/run-python`
- **Production (Vercel)**: Uses proxy endpoint `/api/python-proxy`

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. The app will run on `http://localhost:4000` and automatically use the direct Python API endpoint.

## Production Deployment (Vercel)

1. The app is configured for Vercel deployment with:
   - `api/python-proxy.js` - Serverless function that proxies requests to the Python API
   - `vercel.json` - Deployment configuration
   - Automatic environment detection

2. Deploy to Vercel:
   ```bash
   vercel --prod
   ```

## API Configuration

The configuration is handled in `src/config.js`:

- Detects environment based on `NODE_ENV` and hostname
- Automatically switches between direct API calls (local) and proxy (production)
- Includes debug logging to help troubleshoot environment detection

## Troubleshooting

1. **API calls failing locally**: Check browser console for environment detection logs
2. **CORS issues**: The Python API at `4.188.74.28:4000` must have CORS enabled
3. **Vercel deployment issues**: Check that `api/python-proxy.js` is properly deployed as a serverless function

## Files Modified

- `src/Answer.js` - Updated to use environment-based configuration
- `src/config.js` - New configuration file for environment detection
- `vercel.json` - Vercel deployment configuration
- `README.md` - This documentation