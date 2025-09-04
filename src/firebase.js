import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAj1Zm0S8qsHjqSxvHBTOXFOnDOfzoaGuw",
  authDomain: "vue-form-53431.firebaseapp.com",
  projectId: "vue-form-53431",
  storageBucket: "vue-form-53431.firebasestorage.app",
  messagingSenderId: "879502647573",
  appId: "1:879502647573:web:77cf43f165fdbe3379491c",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
