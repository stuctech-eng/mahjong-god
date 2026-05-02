import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc, updateDoc, arrayUnion, serverTimestamp } from "firebase/firestore";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";

var firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
};

var app  = initializeApp(firebaseConfig);
export var db   = getFirestore(app);
export var auth = getAuth(app);

export async function ensureAnonymousAuth() {
  return new Promise(function(resolve) {
    var unsub = onAuthStateChanged(auth, async function(user) {
      unsub();
      if (user) {
        resolve(user);
      } else {
        try {
          var cred = await signInAnonymously(auth);
          resolve(cred.user);
        } catch (err) {
          resolve(null);
        }
      }
    });
  });
}

export async function loadPlayerData(uid) {
  try {
    var ref  = doc(db, "players", uid);
    var snap = await getDoc(ref);
    return snap.exists() ? snap.data() : null;
  } catch (err) { return null; }
}

export async function savePlayerData(uid, data) {
  try {
    var ref = doc(db, "players", uid);
    await setDoc(ref, Object.assign({}, data, { updatedAt: serverTimestamp() }), { merge: true });
  } catch (err) {}
}

export async function saveSession(uid, sessionData) {
  try {
    var ref = doc(db, "players", uid);
    await updateDoc(ref, {
      sessions:     arrayUnion(Object.assign({}, sessionData, { savedAt: new Date().toISOString() })),
      lastPlayedAt: serverTimestamp(),
    });
  } catch (err) {}
}
