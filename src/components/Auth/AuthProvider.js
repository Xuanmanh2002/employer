import React, { createContext, useState, useContext } from "react";
import {jwtDecode} from "jwt-decode"; 

export const AuthContext = createContext({
  employer: null,
  handleLogin: (token) => {},
  handleLogout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [employer, setEmployer] = useState(null);

  const handleLogin = (token) => {
    try {
      const decodedEmployer = jwtDecode(token);       
      setEmployer(decodedEmployer);
    } catch (error) {
      console.error("Failed to decode token:", error);
    }
  };

  const handleLogout = () => {
    setEmployer(null);
  };

  return (
    <AuthContext.Provider value={{ employer, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
