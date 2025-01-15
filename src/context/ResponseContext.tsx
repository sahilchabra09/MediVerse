"use client";
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface ResponseContextType {
  response: string;
  setResponse: (response: string) => void;
}

const ResponseContext = createContext<ResponseContextType | undefined>(undefined);

export const ResponseProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [response, setResponse] = useState<string>('');

  return (
    <ResponseContext.Provider value={{ response, setResponse }}>
      {children}
    </ResponseContext.Provider>
  );
};

export const useResponse = () => {
  const context = useContext(ResponseContext);
  if (context === undefined) {
    throw new Error('useResponse must be used within a ResponseProvider');
  }
  return context;
};
