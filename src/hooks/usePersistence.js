import { useState, useEffect, useRef, useCallback } from "react";
import { ensureAuth, loadPlayer, savePlayer, saveSession } from "../firebase.js";

var DEFAULT = {
  displayName: "Speler",
  skillScore:  50,
  highScore:   0,
  totalWins:   0,
  totalGames:  0,
};

export function usePersistence() {
  var s1 = useState(null);    var uid = s1[0]; var setUid = s1[1];
  var s2 = useState(DEFAULT); var player = s2[0]; var setPlayer = s2[1];
  var s3 = useState("idle");  var syncStatus = s3[0]; var setSyncStatus = s3[1];
  var timer = useRef(null);

  useEffect(function() {
    setSyncStatus("syncing");
    ensureAuth().then(function(user) {
      if (!user) { setSyncStatus("error"); return; }
      setUid(user.uid);
      loadPlayer(user.uid).then(function(data) {
        if (data) setPlayer(function(prev) { return Object.assign({}, DEFAULT, prev, data); });
        setSyncStatus("ok");
      }).catch(function() { setSyncStatus("error"); });
    }).catch(function() { setSyncStatus("error"); });
  }, []);

  var persistPlayer = useCallback(function(updates) {
    setPlayer(function(prev) {
      var next = Object.assign({}, prev, updates);
      if (uid) {
        clearTimeout(timer.current);
        timer.current = setTimeout(function() {
          savePlayer(uid, next).catch(function() {});
        }, 1500);
      }
      return next;
    });
  }, [uid]);

  var persistSession = useCallback(async function(snap, score, result) {
    if (!uid) return;
    await saveSession(uid, {
      score:     score,
      result:    result,
      moves:     snap.moves     || 0,
      mistakes:  snap.mistakes  || 0,
      hintsUsed: snap.hintsUsed || 0,
      duration:  snap.endTime
                 ? Math.round((snap.endTime - snap.startTime) / 1000) : 0,
    });
  }, [uid]);

  var updateName = useCallback(function(name) {
    if (!name || !name.trim()) return;
    persistPlayer({ displayName: name.trim() });
  }, [persistPlayer]);

  return { uid, player, syncStatus, persistPlayer, persistSession, updateName };
}
