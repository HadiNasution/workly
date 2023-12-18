import { useState, createContext } from "react";

const EmployeeContext = createContext();

const ContextProvider = ({ children }) => {
  const { shot, setShot } = useState("");

  const updateShot = (newShot) => {
    setShot(newShot);
  };

  return (
    <EmployeeContext.Provider value={{ shot, updateShot }}>
      {children}
    </EmployeeContext.Provider>
  );
};

export { ContextProvider, EmployeeContext };
