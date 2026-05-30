import React, { createContext, useContext, useState, useEffect } from 'react';
import pb from '../lib/pocketbaseClient.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(pb.authStore.model);
  const [isAuthenticated, setIsAuthenticated] = useState(pb.authStore.isValid);
  const [initialLoading, setInitialLoading] = useState(true);

  // 🔥 Listen to auth changes (VERY IMPORTANT)
  useEffect(() => {
    const unsubscribe = pb.authStore.onChange(() => {
      setCurrentUser(pb.authStore.model);
      setIsAuthenticated(pb.authStore.isValid);
    });

    setInitialLoading(false);

    return () => unsubscribe();
  }, []);

  // ✅ LOGIN
  const login = async (email, password) => {
    const authData = await pb.collection('app_users').authWithPassword(email, password);
    setCurrentUser(authData.record);
    setIsAuthenticated(true);
    return authData.record;
  };

  // ✅ SIGNUP + AUTO LOGIN
  const signup = async (email, password,passwordConfirm, name, role,college_id) => {
    const userData = {
      email,
      password,
      passwordConfirm,
      name,
      role:role.toLowerCase(),
    };
     if (role.toLowerCase() === "student" && college_id) {
    userData.college_id = college_id;
  }
    await pb.collection('app_users').create(userData);

    // 🔥 auto login after signup
    const authData = await pb.collection('app_users').authWithPassword(email, password);

    setCurrentUser(authData.record);
    setIsAuthenticated(true);

    return authData.record;
  };

  // ✅ LOGOUT
  const logout = () => {
    pb.authStore.clear();
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        login,
        signup,
        logout,
        initialLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};