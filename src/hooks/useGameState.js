import { useState, useCallback, useRef, useEffect } from "react";
import { LAYOUTS, DEFAULT_LAYOUT } from "../data/layouts.js";
import { generateBoard } from "../engine/BoardGenerator.js";
import { isTileFree, tilesMatch, getFreePairs, removePair, restorePair } from "../engine/TileLogic.js";
import { calcPoints } from "../systems/Scoring.js";
import { Haptics } from "../systems/Haptics.js";
import { Audio } from "../systems/Audio.js";

export var STATUS = { MENU:"menu", PLAYING:"playing", WON:"won", LOST:"lost" };

var SESSION_FRESH = function() {
  return { moves:0, mistakes:0, hintsUsed:0, undosUsed:0, startTime:Date.now(), endTime:null };
};

export function useGameState(skillScore, onSessionEnd) {
  var s1  = useState(STATUS.MENU); var status  = s1[0]; var setStatus  = s1[1];
  var s2  = useState([]);          var tiles   = s2[0]; var setTiles   = s2[1];
  var s3  = useState(null);        var sel     = s3[0]; var setSel     = s3[1];
  var s4  = useState(0);           var score   = s4[0]; var setScore   = s4[1];
  var s5  = useState(0);           var combo   = s5[0]; var setCombo   = s5[1];
  var s6  = useState([]);          var history = s6[0]; var setHistory = s6[1];
  var s7  = useState([]);          var hintIds = s7[0]; var setHintIds = s7[1];
  var s8  = useState([]);          var matchIds= s8[0]; var setMatchIds= s8[1];
  var s9  = useState(null);        var mistakeId=s9[0]; var setMistakeId=s9[1];
  var s10 = useState(new Set());   var glowIds = s10[0]; var setGlowIds = s10[1];
  var s11 = useState(null);        var comboPopup=s11[0];var setComboPopup=s11[1];
  var s12 = useState(DEFAULT_LAYOUT); var layoutId=s12[0];var setLayoutId=s12[1];

  var session  = useRef(SESSION_FRESH());
  var lastMove = useRef(Date.now());
  var comboTimer = useRef(null);
  var matchTimer = useRef(null);

  var active = tiles.filter(function(t) { return !t.removed; });
  var pairs  = getFreePairs(tiles);

  useEffect(function() {
    if (status !== STATUS.PLAYING || tiles.length === 0) return;
    if (active.length === 0) {
      session.current.endTime = Date.now();
      setStatus(STATUS.WON);
      Haptics.win(); Audio.win();
      if (onSessionEnd) onSessionEnd(session.current, score, "win");
      return;
    }
    if (pairs.length === 0 && active.length > 0) {
      session.current.endTime = Date.now();
      setStatus(STATUS.LOST);
      Haptics.lose(); Audio.lose();
      if (onSessionEnd) onSessionEnd(session.current, score, "loss");
      return;
    }
    if (pairs.length <= 3) {
      var glowSet = new Set();
      pairs.forEach(function(pair) {
        glowSet.add(pair[0].id);
        glowSet.add(pair[1].id);
      });
      setGlowIds(glowSet);
    } else {
      setGlowIds(new Set());
    }
  }, [tiles, status]);

  var startGame = useCallback(function(lid) {
    var id     = lid || layoutId;
    var layout = LAYOUTS[id] || LAYOUTS[DEFAULT_LAYOUT];
    session.current = SESSION_FRESH();
    lastMove.current = Date.now();
    clearTimeout(comboTimer.current);
    clearTimeout(matchTimer.current);
    setTiles(generateBoard(layout.positions));
    setSel(null); setScore(0); setCombo(0); setHistory([]);
    setHintIds([]); setMatchIds([]); setMistakeId(null);
    setGlowIds(new Set()); setComboPopup(null);
    setLayoutId(id); setStatus(STATUS.PLAYING);
  }, [layoutId]);

  var handleClick = useCallback(function(tile) {
    if (status !== STATUS.PLAYING) return;
    if (!isTileFree(tile, tiles)) return;
    setHintIds([]);

    if (!sel) {
      Haptics.select(); Audio.select();
      setSel(tile);
      return;
    }
    if (sel.id === tile.id) { setSel(null); return; }

    if (tilesMatch(sel, tile)) {
      var now  = Date.now();
      var ms   = now - lastMove.current;
      lastMove.current = now;
      session.current.moves++;
      var newCombo = combo + 1;
      var pts = calcPoints(tile, newCombo, skillScore, ms);
      setCombo(newCombo);
      setScore(function(s) { return s + pts; });
      setHistory(function(h) { return h.concat([{ id1:sel.id, id2:tile.id, pts:pts }]); });
      setMatchIds([sel.id, tile.id]);
      matchTimer.current = setTimeout(function() { setMatchIds([]); }, 380);
      setTiles(function(prev) { return removePair(prev, sel.id, tile.id); });
      setSel(null);
      if (newCombo >= 2) {
        Haptics.combo(newCombo); Audio.combo(newCombo);
        clearTimeout(comboTimer.current);
        setComboPopup({ count:newCombo, pts:pts });
        comboTimer.current = setTimeout(function() { setComboPopup(null); }, 1600);
      } else {
        Haptics.match(); Audio.match();
      }
    } else {
      session.current.mistakes++;
      Haptics.mistake(); Audio.mistake();
      setMistakeId(tile.id);
      setCombo(0);
      setTimeout(function() { setMistakeId(null); }, 380);
      setSel(null);
    }
  }, [status, tiles, sel, combo, skillScore]);

  var handleHint = useCallback(function() {
    if (status !== STATUS.PLAYING) return;
    session.current.hintsUsed++;
    Haptics.hint(); Audio.hint();
    var p = getFreePairs(tiles);
    if (p.length === 0) return;
    setHintIds([p[0][0].id, p[0][1].id]);
    setTimeout(function() { setHintIds([]); }, 2500);
  }, [status, tiles]);

  var handleUndo = useCallback(function() {
    if (status !== STATUS.PLAYING || history.length === 0) return;
    session.current.undosUsed++;
    Haptics.undo(); Audio.undo();
    var last = history[history.length - 1];
    setTiles(function(prev) { return restorePair(prev, last.id1, last.id2); });
    setHistory(function(h) { return h.slice(0,-1); });
    setScore(function(s) { return Math.max(0, s - last.pts); });
    setCombo(0); setSel(null);
  }, [status, history]);

  var handleShuffle = useCallback(function() {
    if (status !== STATUS.PLAYING) return;
    Haptics.shuffle(); Audio.shuffle();
    setTiles(function(prev) {
      var act = prev.filter(function(t) { return !t.removed; });
      var types = act.map(function(t) { return { suit:t.suit, value:t.value }; });
      var i, j, tmp;
      for (i=types.length-1;i>0;i--) {
        j = Math.floor(Math.random()*(i+1));
        tmp=types[i]; types[i]=types[j]; types[j]=tmp;
      }
      var idx = 0;
      return prev.map(function(t) {
        if (t.removed) return t;
        return Object.assign({}, t, types[idx++]);
      });
    });
    setCombo(0); setSel(null);
  }, [status]);

  return {
    status, tiles, selected:sel, score, combo, history, layoutId,
    hintIds, matchIds, mistakeId, glowIds, comboPopup,
    activeTiles: active, totalTiles: tiles.length, availPairs: pairs.length,
    session: session.current,
    startGame, handleClick, handleHint, handleUndo, handleShuffle,
  };
}
