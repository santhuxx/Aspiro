'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AuthContext: Initializing auth listener');
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('AuthContext: onAuthStateChanged', { email: user?.email || 'null', emailVerified: user?.emailVerified || false });
      if (user && user.emailVerified) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
        if (user && !user.emailVerified) {
          console.warn('User email not verified:', user.email);
        }
      }
      setLoading(false);
    }, (error) => {
      console.error('AuthContext: onAuthStateChanged error', error);
      setLoading(false);
    });
    return () => {
      console.log('AuthContext: Cleaning up auth listener');
      unsubscribe();
    };
  }, []);

  console.log('AuthContext: Providing value', { currentUser: currentUser?.email || 'null', loading });

  return (
    <AuthContext.Provider value={{ currentUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  console.log('useAuth: Context value', { currentUser: context?.currentUser?.email || 'null', loading: context?.loading });
  if (context === undefined) {
    console.error('useAuth must be used within an AuthProvider');
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;