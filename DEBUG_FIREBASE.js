// 🧪 TEST FIREBASE CONNECTION
// Copy đoạn code này vào Console (F12) để test

// 1. Kiểm tra Auth Mode
console.log('🔐 Auth Mode:', localStorage.getItem('authMode'));
console.log('✅ Authenticated:', localStorage.getItem('isAuthenticated'));

// 2. Kiểm tra Firebase User
import { getCurrentUser } from './services/firebase';
const user = getCurrentUser();
if (user) {
  console.log('👤 Firebase User:', user.email, '| UID:', user.uid);
} else {
  console.error('❌ No Firebase user logged in!');
}

// 3. Kiểm tra Local Data
const localData = JSON.parse(localStorage.getItem('quanlythuchi_transactions') || '[]');
console.log('📊 Local Transactions:', localData.length);

// 4. Test Manual Sync
import { getAllTransactionsFromFirebase } from './services/firebase';
getAllTransactionsFromFirebase().then(result => {
  if (result.success) {
    console.log('🔥 Firebase Transactions:', result.transactions.length);
    result.transactions.forEach(t => {
      console.log('  -', t.date, t.type, t.amount, t.person);
    });
  } else {
    console.error('❌ Firebase fetch failed:', result.error);
  }
});
