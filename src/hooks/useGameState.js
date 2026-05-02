import { useState, useCallback, useRef, useEffect } from "react";
import { LAYOUTS, DEFAULT_LAYOUT } from "../data/layouts.js";
import { generateBoard } from "../engine/BoardGenerator.js";
import { isTileFree, tilesMatch, getAvailablePairs, removePair, restorePair } from "../engine/TileLogic.js";
import { calculatePoints } from "../systems/Scoring.js";
import { Haptics } from "../systems/Haptics.js";
import { Audio } from "../systems/Audio.js";
import { evaluateFlow, FLOW_EVENTS } from "../systems/FlowControl.js";
import { useAnalytics } from "./useAnalytics.js";

export var GAME_STATUS = { MENU:"menu", PLAYING:"playing", WON:"won", LOST:"lost" };

export function useGameState({ skillScore, onSkillUpdate, onSessionEnd }) {
  var s1  = useState(GAME_STATUS.MENU); var status     = s1[0]; var setStatus     = s1[1];
  var s2  = useState([]);               var tiles      = s2[0]; var setTiles      = s2[1];
  var s3  = useState(null);             var selected   = s3[0]; var setSelected   = s3[1];
  var s4  = useState(0);                var score      = s4[0]; var setScore      = s4[1];
  var s5  = useState(0);                var combo      = s5[0]; var setCombo      = s5[1];
  var s6  = useState([]);               var history    = s6[0]; var setHistory    = s6[1];
  var s7  = useState(DEFAULT_LAYOUT);   var layoutId   = s7[0]; var setLayoutId   = s7[1];
  var s8  = useState([]);               var hintIds    = s8[0]; var setHintIds    = s8[1];
  var s9  = useState([]);               var matchIds   = s9[0]; var setMatchIds   = s9[1];
  var s10 = useState(null);             var mistakeId  = s10[0]; var setMistakeId = s10[1];
  var s11 = useState(new Set());        var glowIds    = s11[0]; var setGlowIds   = s11[1];
  var s12 = useState(0);                var availPairs = s12[0]; var setAvailPairs= s12[1];
  var s13 = useState(null);             var flowEvent  = s13[0]; var setFlowEvent = s13[1];
  var s14 = useState(null);             var comboPopup = s14[0]; var setComboPopup= s14[1];

  var lastMove   = useRef(Date.now());
  var flowTimer  = useRef(null);
  var comboTimer = useRef(null);

  var analytics = useAnalytics(skillScore, onSkillUpdate);

  var activeTiles = tiles.filter(function(t) { return !t.removed; });
  var totalTiles  = tiles.length;

  useEffect(function() {
    if (status !== GAME_STATUS.PLAYING || tiles.length === 0) return;
    var pairs = getAvailablePairs(tiles);
    setAvailPairs(pairs.length);
    if (pairs.length > 0 && pairs.length <= 3) {
      setGlowIds(new Set(pairs.reduce(function(acc, p) { return acc.concat([p[0].id, p[1].id]); }, [])));
    } else {
      setGlowIds(new Set());
    }
    if (activeTiles.length === 0) {
      var snap = analytics.recordResult("win");
      setStatus(GAME_STATUS.WON);
      Haptics.win(); Audio.win();
      if (onSessionEnd) onSessionEnd(snap, score, "win");
      return;
    }
    if (pairs.length === 0 && activeTiles.length > 0) {
      var snap2 = analytics.recordResult("loss");
      setStatus(GAME_STATUS.LOST);
      Haptics.lose(); Audio.lose();
      if (onSessionEnd) onSessionEnd(snap2, score, "loss");
      return;
    }
    var ev = evaluateFlow(analytics.engine, pairs.length);
    setFlowEvent(ev);
  }, [tiles, status]);

  var resetFlowTimer = useCallback(function() {
    clearTimeout(flowTimer.current);
    flowTimer.current = setTimeout(function() {
      if (analytics.isStuck()) setFlowEvent(FLOW_EVENTS.STUCK_INACTIVE);
    }, 28000);
  }, [analytics]);

  var startGame = useCallback(function(layoutOverride) {
    var lid    = layoutOverride || layoutId;
    var layout = LAYOUTS[lid] || LAYOUTS[DEFAULT_LAYOUT];
    var newTiles = generateBoard(layout.positions, skillScore);
    analytics.reset();
    lastMove.current = Date.now();
    clearTimeout(flowTimer.current);
    clearTimeout(comboTimer.current);
    setTiles(newTiles); setSelected(null); setScore(0); setCombo(0);
    setHistory([]); setLayoutId(lid); setHintIds([]); setMatchIds([]);
    setMistakeId(null); setGlowIds(new Set()); setFlowEvent(null);
    setComboPopup(null); setStatus(GAME_STATUS.PLAYING);
    resetFlowTimer();
  }, [layoutId, skillScore, analytics, resetFlowTimer]);

  var handleTileClick = useCallback(function(tile) {
    if (status !== GAME_STATUS.PLAYING) return;
    if (!isTileFree(tile, tiles)) return;
    resetFlowTimer();
    setFlowEvent(null);
    setHintIds([]);
    if (!selected) {
      Haptics.select(); Audio.select();
      setSelected(tile);
      return;
    }
    if (selected.id === tile.id) { setSelected(null); return; }
    if (tilesMatch(selected, tile)) {
      var now      = Date.now();
      var moveTime = now - lastMove.current;
      lastMove.current = now;
      analytics.recordMove(tile.suit + "_" + tile.value);
      var newCombo = combo + 1;
      var pts      = calculatePoints(tile, newCombo, skillScore, moveTime);
      setCombo(newCombo);
      setScore(function(s) { return s + pts; });
      setHistory(function(h) { return h.concat([{ id1: selected.id, id2: tile.id, pts: pts }]); });
      setMatchIds([selected.id, tile.id]);
      setTimeout(function() { setMatchIds([]); }, 400);
      setTiles(function(prev) { return removePair(prev, selected.id, tile.id); });
      setSelected(null);
      if (newCombo >= 2) {
        Haptics.combo(newCombo); Audio.combo(newCombo);
        clearTimeout(comboTimer.current);
        setComboPopup({ count: newCombo, pts: pts });
        comboTimer.current = setTimeout(function() { setComboPopup(null); }, 1600);
      } else {
        Haptics.match(); Audio.match();
      }
    } else {
      analytics.recordMistake();
      Haptics.mistake(); Audio.mistake();
      setMistakeId(tile.id);
      setCombo(0);
      setTimeout(function() { setMistakeId(null); }, 400);
      setSelected(null);
    }
  }, [status, tiles, selected, combo, skillScore, analytics, resetFlowTimer]);

  var handleHint = useCallback(function() {
    if (status !== GAME_STATUS.PLAYING) return;
    analytics.recordHint();
    Haptics.hint(); Audio.hint();
    var pairs = getAvailablePairs(tiles);
    if (pairs.length === 0) return;
    var pair = pairs[0];
    if (skillScore < 35)      setHintIds([pair[0].id, pair[1].id]);
    else if (skillScore < 65) setHintIds([pair[0].id]);
    else setGlowIds(new Set([pair[0].id, pair[1].id]));
    setTimeout(function() { setHintIds([]); }, 3000);
    setFlowEvent(null);
  }, [status, tiles, skillScore, analytics]);

  var handleUndo = useCallback(function() {
    if (status !== GAME_STATUS.PLAYING || history.length === 0) return;
    analytics.recordUndo();
    Haptics.undo(); Audio.undo();
    var last = history[history.length - 1];
    setTiles(function(prev) { return restorePair(prev, last.id1, last.id2); });
    setHistory(function(h) { return h.slice(0, -1); });
    setScore(function(s) { return Math.max(0, s - last.pts); });
    setCombo(0); setSelected(null);
  }, [status, history, analytics]);

  var handleShuffle = useCallback(function() {
    if (status !== GAME_STATUS.PLAYING) return;
    analytics.recordShuffle();
    Haptics.shuffle(); Audio.shuffle();
    setTiles(function(prev) {
      var active = prev.filter(function(t) { return !t.removed; });
      var types  = active.map(function(t) { return { suit:t.suit, value:t.value }; });
      for (var i = types.length-1; i > 0; i--) {
        var j = Math.floor(Math.random()*(i+1));
        var tmp = types[i]; types[i] = types[j]; types[j] = tmp;
      }
      var idx = 0;
      return prev.map(function(t) {
        if (t.removed) return t;
        return Object.assign({}, t, types[idx++]);
      });
    });
    setCombo(0); setSelected(null); setFlowEvent(null);
  }, [status, analytics]);

  return {
    status, tiles, selected, score, combo, history, layoutId,
    hintIds, matchIds, mistakeId, glowIds, availPairs, flowEvent, comboPopup,
    activeTiles, totalTiles, engine: analytics.engine,
    startGame, handleTileClick, handleHint, handleUndo, handleShuffle,
  };
}
