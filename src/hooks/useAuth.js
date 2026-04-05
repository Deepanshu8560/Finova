import { useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider,
  signOut as firebaseSignOut 
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../lib/firebase';

/**
 * Authentication hook exposing robust Firebase endpoints and state with a mock fallback loop.
 * 
 * @returns {Object} User session, states, and action modifiers.
 */
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getRoleFromEmail = (email) => {
    if (!email) return 'Viewer';
    const emailLower = email.toLowerCase();
    if (emailLower.startsWith('admin') || emailLower.startsWith('founder')) return 'Admin';
    return 'Viewer';
  };

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      // Mock mode - no real auth, just leave user as null (login sets it manually)
      setTimeout(() => setLoading(false), 300);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        currentUser.role = getRoleFromEmail(currentUser.email);
      }
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    setError(null);
    setLoading(true);
    try {
      if (!isFirebaseConfigured) {
        await new Promise(r => setTimeout(r, 600));
        const mockUser = { uid: 'mock_uid_1', email, displayName: 'Founder' };
        mockUser.role = getRoleFromEmail(email);
        setUser(mockUser);
        return;
      }
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError(err.message || 'Failed to login');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email, password) => {
    setError(null);
    setLoading(true);
    try {
      if (!isFirebaseConfigured) {
        await new Promise(r => setTimeout(r, 600));
        const mockUser = { uid: 'mock_uid_2', email, displayName: 'New Founder' };
        mockUser.role = getRoleFromEmail(email);
        setUser(mockUser);
        return;
      }
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError(err.message || 'Failed to sign up');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setError(null);
    setLoading(true);
    try {
      if (!isFirebaseConfigured) {
        await new Promise(r => setTimeout(r, 800));
        const mockUser = { uid: 'mock_uid_oauth', email: 'founder@finova.com', displayName: 'Google Founder' };
        mockUser.role = 'Admin';
        setUser(mockUser);
        return;
      }
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err) {
      setError(err.message || 'Failed to login with Google');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      if (!isFirebaseConfigured) {
        setUser(null);
        return;
      }
      await firebaseSignOut(auth);
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, error, login, signup, loginWithGoogle, logout };
};

export default useAuth;
