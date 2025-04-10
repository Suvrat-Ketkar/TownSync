// src/utils/apiBase.js

export const getApiBaseUrl = () => {
    const devPort = 3500; // Port where your Express backend runs
  
    // Get frontend host (e.g., 192.168.x.x or localhost)
    const frontendHost = window.location.hostname;
  
    return `http://${frontendHost}:${devPort}`;
  };
  