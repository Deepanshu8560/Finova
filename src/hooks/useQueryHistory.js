import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  onSnapshot,
  addDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';

export function useQueryHistory(userId) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Real-time listener for user's query history
  useEffect(() => {
    if (!userId || !isFirebaseConfigured) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'queries'),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc'),
      limit(50) // Cap at last 50
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setHistory(docs);
      setLoading(false);
    }, (error) => {
      console.error("Failed to fetch query history:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  // Method to manually push to history (invoked by useAIQuery or component logic)
  const saveQuery = async (question, answer, latencyMs = 0) => {
    if (!userId || !isFirebaseConfigured) {
      // Mock mode fallback logic: push to local array
      setHistory(prev => [{
        id: Math.random().toString(),
        question,
        answer,
        latencyMs,
        timestamp: new Date(),
        userId: userId || 'anonymous'
      }, ...prev].slice(0, 50));
      return;
    }

    try {
      await addDoc(collection(db, 'queries'), {
        userId,
        question,
        answer,
        latencyMs,
        timestamp: serverTimestamp()
      });
    } catch (err) {
      console.error("Failed to save query:", err);
    }
  };

  return { history, loading, saveQuery };
}
