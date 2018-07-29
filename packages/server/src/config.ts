// This module defines the environment variables used throughout the app.

export const apiAuthority = process.env.WKSPH_UI_API_AUTHORITY || 'localhost:8001';
export const resourcesRoot = process.env.WKSPH_UI_RESOURCES_ROOT || `http://localhost:4041`;

let port = 4040
if (process.env.WKSPH_UI_SERVER_PORT) {
  let envPort = parseInt(process.env.WKSPH_UI_SERVER_PORT);
  if (isNaN(envPort) || envPort < 1) {
    console.warn(`WKSPH_UI_LOCAL_PORT is being ignored because it is not a positive number. Got ${envPort}`);
  }
  port = envPort
}

export const serverPort = port;
export const serverHost = process.env.WKSPH_UI_SERVER_HOSTNAME || '127.0.0.1';