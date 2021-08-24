import fb from "firebase";
import admin from "firebase-admin";
import functions = require("firebase-functions");

// Firebase Admin
admin.initializeApp();
const db = admin.firestore();

export { admin, db };

// API Information and Firebase

const startFirebase = () => {
  const CONFIG = functions.config();
  fb.initializeApp(CONFIG);

  if (process.env.FUNCTIONS_EMULATOR === "true") {
    fb.auth().useEmulator("http://localhost:9099");
    fb.functions().useEmulator("localhost", 5001);
    fb.firestore().useEmulator("localhost", 8080);
  }

  return fb;
};

export const firebase = startFirebase();
