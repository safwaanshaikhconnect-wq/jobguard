/**
 * JobGuard Global Configuration
 * 
 * When deploying to Vercel, set the VITE_API_URL environment variable 
 * to your backend endpoint (e.g., https://your-backend.herokuapp.com).
 */

const rawUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
export const API_BASE_URL = rawUrl.endsWith('/') ? rawUrl.slice(0, -1) : rawUrl;

export const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
