import React, {createContext, ReactNode, useMemo, useState} from "react";

interface ErrorContextProps {
  error: string | null;
  handleError: (errorMessage: string) => void;
  clearError: () => void;
}

export const ErrorContext = createContext<ErrorContextProps>({
  error: null,
  handleError: () => {},
  clearError: () => {},
});

export const ErrorContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [error, setError] = useState<string | null>(null);

  const contextValue = {
    error,
    handleError: (errorMessage: string) => setError(errorMessage),
    clearError: () => setError(null)
  }

  return (
    <ErrorContext.Provider value={contextValue}>
      {children}
    </ErrorContext.Provider>
  );
};
