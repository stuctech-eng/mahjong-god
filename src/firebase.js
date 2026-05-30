import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc, updateDoc, arrayUnion, serverTimestamp } from "firebase/firestore";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";

var cfg = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
};

var app  = initializeApp(cfg);
export var db   = getFirestore(app);
export var auth = getAuth(app);

export async function ensureAuth() {
  return new Promise(function(resolve) {
    var unsub = onAuthStateChanged(auth, async function(user) {
      unsub();
      if (user) { resolve(user); return; }
      try { var c = await signInAnonymously(auth); resolve(c.user); }
      catch(e) { resolve(null); }
    });
  });
}

export async function loadPlayer(uid) {
  try {
    var snap = await getDoc(doc(db, "players", uid));
    return snap.exists() ? snap.data() : null;
  } catch(e) { return null; }
}

export async function savePlayer(uid, data) {
  try {
    await setDoc(doc(db, "players", uid),
      Object.assign({}, data, { updatedAt: serverTimestamp() }),
      { merge: true }
    );
  } catch(e) {}
}

export async function saveSession(uid, session) {
  try {
    await updateDoc(doc(db, "players", uid), {
      sessions:     arrayUnion(Object.assign({}, session, { at: new Date().toISOString() })),
      lastPlayedAt: serverTimestamp(),
    });
  } catch(e) {}
}
