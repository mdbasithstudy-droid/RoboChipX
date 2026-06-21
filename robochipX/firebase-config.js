// ─── Firebase Config ──────────────────────────────────────────────────────────
const firebaseConfig = {
  apiKey:            "AIzaSyAumeeM51_Oo_ovokfWZlkWNqLdC5hx_dY",
  authDomain:        "robochipx-b6f36.firebaseapp.com",
  projectId:         "robochipx-b6f36",
  storageBucket:     "robochipx-b6f36.firebasestorage.app",
  messagingSenderId: "733746675677",
  appId:             "1:733746675677:web:6e742efac52684dce3c034",
  measurementId:     "G-MKRTB6FL1F"
};

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore }  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
