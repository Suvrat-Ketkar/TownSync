// Function to safely get an environment variable with a fallback default value
const getEnv = (key, defaultValue) => {

    const value = process.env[key];

    if (!value && defaultValue) {
      return defaultValue; // Return default value if environment variable is not defined
    }
    if (!value) {
      throw new Error(`Missing environment variable: ${key}`);
    }
    return value;
  };
  
  

export const NODE_ENV = getEnv("NODE_ENV", "development");
export const PORT = getEnv("PORT", "4004");
export const MONGO_URI = getEnv("MONGO_URI");
export const JWT_SECRET = getEnv("JWT_SECRET");
