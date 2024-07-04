import React, { createContext, useState, useContext } from 'react';

// Create a context for the screenshot
const ScreenshotContext = createContext();

export const ScreenshotProvider = ({ children }) => {
  const [base64Image, setBase64Image] = useState(null);

  return (
    <ScreenshotContext.Provider value={{ base64Image, setBase64Image }}>
      {children}
    </ScreenshotContext.Provider>
  );
};

// Custom hook to use the ScreenshotContext
export const useScreenshot = () => useContext(ScreenshotContext);
