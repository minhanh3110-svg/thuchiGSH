import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, deleteDoc, onSnapshot, query, orderBy } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyATicaltP6oyDMcc6F-sGWowJDyWO2SFts",
  authDomain: "quanlythuchi-4fe1c.firebaseapp.com",
  projectId: "quanlythuchi-4fe1c",
  storageBucket: "quanlythuchi-4fe1c.firebasestorage.app",
  messagingSenderId: "318067137941",
  appId: "1:318067137941:web:aee68e34a9e4ed79c26a9c",
  measurementId: "G-C0ZB2YJJ8G"
};

// Initialize Firebase
let app;
let auth;
let db;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} catch (error) {
  console.error("Firebase initialization error:", error);
}

// Authentication functions
export const firebaseSignIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const firebaseSignUp = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const firebaseSignOut = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

export const getCurrentUser = () => {
  return auth?.currentUser;
};

// Firestore functions
export const syncTransactionToFirebase = async (transaction) => {
  try {
    const user = getCurrentUser();
    if (!user) {
      console.error('❌ [Firebase Sync] Not authenticated');
      return { success: false, error: 'Not authenticated' };
    }

    console.log('🔄 [Firebase Sync] Syncing transaction:', transaction.id, 'for user:', user.email);
    const transactionRef = doc(db, `users/${user.uid}/transactions/${transaction.id}`);
    await setDoc(transactionRef, {
      ...transaction,
      updatedAt: new Date().toISOString()
    });
    
    console.log('✅ [Firebase Sync] Success!');
    return { success: true };
  } catch (error) {
    console.error("❌ [Firebase Sync] Error:", error);
    return { success: false, error: error.message };
  }
};

export const deleteTransactionFromFirebase = async (transactionId) => {
  try {
    const user = getCurrentUser();
    if (!user) {
      console.error('❌ [Firebase Delete] Not authenticated');
      return { success: false, error: 'Not authenticated' };
    }

    // Ensure transactionId is string for consistency
    const id = String(transactionId);
    console.log('🗑️ [Firebase Delete] Deleting transaction:', id, 'for user:', user.email, 'UID:', user.uid);
    const transactionRef = doc(db, `users/${user.uid}/transactions/${id}`);
    await deleteDoc(transactionRef);
    
    console.log('✅ [Firebase Delete] Success! Transaction', id, 'deleted from Firebase');
    return { success: true };
  } catch (error) {
    console.error("❌ [Firebase Delete] Error:", error);
    if (error.code === 'permission-denied') {
      console.error('🚫 [Firebase Delete] Permission denied - check Firebase Security Rules!');
    }
    return { success: false, error: error.message };
  }
};

export const getAllTransactionsFromFirebase = async () => {
  try {
    const user = getCurrentUser();
    if (!user) return { success: false, error: 'Not authenticated' };

    const transactionsRef = collection(db, `users/${user.uid}/transactions`);
    const q = query(transactionsRef, orderBy('date', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const transactions = [];
    querySnapshot.forEach((doc) => {
      transactions.push({ id: doc.id, ...doc.data() });
    });
    
    return { success: true, transactions };
  } catch (error) {
    console.error("Fetch error:", error);
    return { success: false, error: error.message };
  }
};

export const listenToTransactions = (callback) => {
  try {
    const user = getCurrentUser();
    if (!user) {
      console.warn('⚠️ [Firebase Listener] No user logged in');
      return null;
    }

    console.log('👂 [Firebase Listener] Setting up realtime listener for user:', user.email, 'UID:', user.uid);
    const transactionsRef = collection(db, `users/${user.uid}/transactions`);
    const q = query(transactionsRef, orderBy('date', 'desc'));
    
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        console.log('📡 [Firebase Listener] Snapshot received! Docs count:', snapshot.size);
        const transactions = [];
        snapshot.forEach((doc) => {
          transactions.push({ id: doc.id, ...doc.data() });
        });
        console.log('📦 [Firebase Listener] Calling callback with', transactions.length, 'transactions');
        callback(transactions);
      }, 
      (error) => {
        console.error('❌ [Firebase Listener] Error:', error);
        // Retry on error
        if (error.code === 'permission-denied') {
          console.error('🚫 [Firebase Listener] Permission denied - check Firebase Security Rules!');
        }
      }
    );
    
    console.log('✅ [Firebase Listener] Listener setup complete');
    return unsubscribe;
  } catch (error) {
    console.error('❌ [Firebase Listener] Setup error:', error);
    return null;
  }
};

export { auth, db };
