// Environment configuration
const config = {
  development: {
    // For local development, call the Python API directly
    pythonApiUrl: 'http://4.188.74.28:4000/api/run-python'
  },
  production: {
    // For Vercel deployment, use the proxy endpoint
    pythonApiUrl: '/api/python-proxy'
  }
};

// Detect environment
const isDevelopment = process.env.NODE_ENV === 'development' || 
                     window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1';

const currentConfig = isDevelopment ? config.development : config.production;

// Debug logging
console.log('Environment Detection:', {
  NODE_ENV: process.env.NODE_ENV,
  hostname: window.location.hostname,
  isDevelopment,
  selectedConfig: currentConfig
});

export default currentConfig;