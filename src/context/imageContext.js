import React, { createContext, useState, useContext } from 'react';

// Create a context for the screenshot
const ScreenshotContext = createContext();

// Placeholder base64 image (replace with an actual base64 string if needed)
const defaultBase64Image = ""; // Use a valid base64 image string or keep it empty

export const ScreenshotProvider = ({ children }) => {
  const [base64Image, setBase64Image] = useState(defaultBase64Image);

  return (
    <ScreenshotContext.Provider value={{ base64Image, setBase64Image }}>
      {children}
    </ScreenshotContext.Provider>
  );
};

// Custom hook to use the ScreenshotContext
export const useScreenshot = () => useContext(ScreenshotContext);
