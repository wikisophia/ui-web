// This module defines the environment variables used throughout the app.

export const apiAuthority = process.env.WKSPH_UI_API_AUTHORITY || 'localhost:8001';
export const resourcesRoot = process.env.WKSPH_UI_RESOURCES_ROOT ||
  'https://cdn.jsdelivr.net/npm/@wikisophia/api-client@0.6.0/dist';
