import React, { createContext, useState, useContext, ReactNode } from 'react';

interface TextRecognitionContextProps {
  recognizedText: string;
  setRecognizedText: React.Dispatch<React.SetStateAction<string>>;
}

interface TextRecognitionProviderProps {
  children: ReactNode;
}

const TextRecognitionContext = createContext<TextRecognitionContextProps | undefined>(undefined);

export const TextRecognitionProvider: React.FC<TextRecognitionProviderProps> = ({ children }) => {
  const [recognizedText, setRecognizedText] = useState<string>('');

  return (
    <TextRecognitionContext.Provider value={{ recognizedText, setRecognizedText }}>
      {children}
    </TextRecognitionContext.Provider>
  );
};

export const useTextRecognition = (): TextRecognitionContextProps => {
  const context = useContext(TextRecognitionContext);
  if (context === undefined) {
    throw new Error('useTextRecognition must be used within a TextRecognitionProvider');
  }
  return context;
};
