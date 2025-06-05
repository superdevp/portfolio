import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyAoHDDTPpdqfSESQKp6U5ldlWivsx1FZak",
  authDomain: "my-portfolio-30e6e.firebaseapp.com",
  projectId: "my-portfolio-30e6e",
  storageBucket: "my-portfolio-30e6e.firebasestorage.app",
  messagingSenderId: "612623305562",
  appId: "1:612623305562:web:d9cc9cb123e1f2e7e38163",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase services
export const db = getFirestore(app)
export const auth = getAuth(app)
export const storage = getStorage(app)

export default app
