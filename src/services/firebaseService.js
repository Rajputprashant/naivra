import { initializeApp } from 'firebase/app';
import { 
  getStorage, 
  ref, 
  uploadBytesResumable, 
  getDownloadURL 
} from 'firebase/storage';

import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCW-pijFSgExtUSkEEPQcEYZ74BhIvsVNc",
  authDomain: "naivra-70b50.firebaseapp.com",
  projectId: "naivra-70b50",
  storageBucket: "naivra-70b50.firebasestorage.app",
  messagingSenderId: "280373215698",
  appId: "1:280373215698:web:5630bcd18148dcb8c8c80b",
  measurementId: "G-03NP05FSY0"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// Upload image to Firebase Storage and return URL
export function uploadImageToFirebase(file, onProgress) {
  return new Promise((resolve, reject) => {
    const storageRef = ref(storage, `carpets/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress(Math.round(progress));
      },
      (error) => reject(error),
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(url);
      }
    );
  });
}

// Save product details to Firestore
export async function saveProductToFirestore(product) {
  try {
    const docRef = await addDoc(collection(db, 'carpets'), product);
    return docRef.id;
  } catch (error) {
    throw error;
  }
}