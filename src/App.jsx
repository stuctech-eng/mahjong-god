import { useCallback, useMemo, useState, useEffect, useRef } from "react";
import { useGameState, GAME_STATUS } from "./hooks/useGameState.js";
import { usePersistence }            from "./hooks/usePersistence.js";
import { buildScoreSummary }         from "./systems/Scoring.js";
import { Board }                     from "./components/Board.jsx";
import { HUD, ActionBar }            from "./components/HUD.jsx";
import { MainMenu, WinScreen, LostScreen } from "./components/Menu.jsx";
import { ComboPopup, FlowAlert, SyncIndicator, PauseMenu } from "./components/Overlays.jsx";
import { Leaderboard } from "./components/Leaderboard.jsx";
import { Settings }    from "./components/Settings.jsx";

var DIFFICULTY_SCORES = { easy:15, medium:45, hard:72, god:92 };

function useOrientation() {
  var init = typeof window !== "undefined" ? window.innerWidth > window.innerHeight : false;
  var s = useState(init); var set = s[1];
  useEffect(function() {
    var h = function() { set(window.innerWidth > window.innerHeight); };
    window.addEventListener("resize", h);
    window.addEventListener("orientationchange", h);
    return function() { window.removeEventListener("resize", h); window.removeEventListener("orientationchange", h); };
  }, []);
  return s[0];
}

export default function App() {
  var pers = usePersistence();
  var player = pers.player;
  var syncStatus = pers.syncStatus;
  var persistPlayer = pers.persistPlayer;
  var persistSession = pers.persistSession;
  var updateDisplayName = pers.updateDisplayName;

  var p1 = useState(false);    var isPaused        = p1[0]; var setIsPaused        = p1[1];
  var p2 = useState("turtle"); var savedLayout     = p2[0]; var setSavedLayout     = p2[1];
  var p3 = useState(0);        var timerSecs       = p3[0]; var setTimerSecs       = p3[1];
  var p4 = useState(false);    var timerRunning    = p4[0]; var setTimerRunning    = p4[1];
  var p5 = useState(false);    var showMenu        = p5[0]; var setShowMenu        = p5[1];
  var p6 = useState(false);    var showLeaderboard = p6[0]; var setShowLeaderboard = p6[1];
  var p7 = useState(false);    var showSettings    = p7[0]; var setShowSettings    = p7[1];
  var p8 = useState(72);       var activeSkill     = p8[0]; var setActiveSkill     = p8[1];

  var timerRef = useRef(null);
  var isLandscape = useOrientation();

  var handleSkillUpdate = useCallback(function(sk) { persistPlayer({ skillScore: sk }); }, [persistPlayer]);

  var handleSessionEnd = useCallback(async function(snap, score, result) {
    var newHigh = Math.max(player.highScore || 0, score);
    persistPlayer({ highScore:newHigh, totalGames:(player.totalGames||0)+1, totalWins:(player.totalWins||0)+(result==="win"?1:0) });
    setTimerRunning(false);
    await persistSession(snap, score, result);
  }, [player, persistPlayer, persistSession]);

  var game = useGameState({ skillScore:activeSkill, onSkillUpdate:handleSkillUpdate, onSessionEnd:handleSessionEnd });

  var summary = useMemo(function() {
    if (game.status === GAME_STATUS.WON || game.status === GAME_STATUS.LOST) {
      return buildScoreSummary(game.score, game.engine ? game.engine.session : {}, game.tiles);
    }
    return null;
  }, [game.status]);

  useEffect(function() {
    if (timerRunning) {
      timerRef.current = setInterval(function() { setTimerSecs(function(s) { return s+1; }); }, 1000);
    } else { clearInterval(timerRef.current); }
    return function() { clearInterval(timerRef.current); };
  }, [timerRunning]);

  var m = String(Math.floor(timerSecs/60)).padStart(2,"0");
  var sc = String(timerSecs%60).padStart(2,"0");
  var timerDisplay = m + ":" + sc;

  var medal = null;
  if      (timerSecs < 120) medal = { label:"GOLD",   color:"#fbbf24" };
  else if (timerSecs < 240) medal = { label:"SILVER", color:"#94a3b8" };
  else if (timerSecs < 360) medal = { label:"BRONZE", color:"#cd7c2f" };

  var handleStart = useCallback(function(lid, diff) {
    var skill = DIFFICULTY_SCORES[diff] || 72;
    setActiveSkill(skill);
    setSavedLayout(lid||"turtle"); setTimerSecs(0); setTimerRunning(true);
    setIsPaused(false); setShowMenu(false); setShowLeaderboard(false); setShowSettings(false);
    game.startGame(lid);
  }, [game]);

  var handleContinue = useCallback(function() {
    setTimerSecs(0); setTimerRunning(true); setIsPaused(false);
    setShowMenu(false); setShowLeaderboard(false); setShowSettings(false);
    game.startGame(savedLayout);
  }, [game, savedLayout]);

  var handleRestart = useCallback(function() {
    setTimerSecs(0); setTimerRunning(true); setIsPaused(false);
    setShowMenu(false); setShowLeaderboard(false); setShowSettings(false);
    game.startGame(savedLayout);
  }, [game, savedLayout]);

  var handlePause    = useCallback(function() { setIsPaused(true);  setTimerRunning(false); }, []);
  var handleResume   = useCallback(function() { setIsPaused(false); setTimerRunning(true);  }, []);
  var handleGoToMenu = useCallback(function() { setIsPaused(false); setTimerRunning(false); setTimerSecs(0); setShowMenu(true); }, []);

  var isPlaying = game.status === GAME_STATUS.PLAYING && !showMenu && !showLeaderboard && !showSettings;

  var boardEl = (
    <div style={lay.boardArea}>
      <div style={lay.boardScroll}>
        <Board
          tiles={game.tiles}
          selected={game.selected}
          hintIds={game.hintIds}
          matchIds={game.matchIds}
          mistakeId={game.mistakeId}
          glowIds={game.glowIds}
          onTileClick={game.handleTileClick}
        />
      </div>
    </div>
  );

  return (
    <div style={lay.root}>
      <div style={lay.bg} />
      <div style={lay.glow1} />
      <div style={lay.glow2} />
      <SyncIndicator status={syncStatus} />

      {showLeaderboard && <Leaderboard onClose={function() { setShowLeaderboard(false); }} />}
      {showSettings    && <Settings displayName={player.displayName||"Speler"} skillScore={player.skillScore||50} onChangeName={updateDisplayName} onClose={function() { setShowSettings(false); }} />}

      {(game.status === GAME_STATUS.MENU || showMenu) && !showLeaderboard && !showSettings && (
        <MainMenu
          skillScore={player.skillScore||50}
          highScore={player.highScore||0}
          displayName={player.displayName||"Speler"}
          onStart={handleStart}
          onContinue={handleContinue}
          onChangeName={updateDisplayName}
          onLeaderboard={function() { setShowLeaderboard(true); }}
          onSettings={function()    { setShowSettings(true);    }}
        />
      )}

      {game.status === GAME_STATUS.WON && !showMenu && !showLeaderboard && !showSettings && (
        <WinScreen score={game.score} summary={summary||{}} timerSecs={timerSecs} medal={medal} onRestart={handleRestart} onMenu={handleGoToMenu} />
      )}
      {game.status === GAME_STATUS.LOST && !showMenu && !showLeaderboard && !showSettings && (
        <LostScreen score={game.score} summary={summary||{}} onRestart={handleRestart} onMenu={handleGoToMenu} />
      )}

      {isPlaying && isLandscape && (
        <div style={lay.landscape}>
          <HUD score={game.score} activeTiles={game.activeTiles.length} totalTiles={game.totalTiles} availPairs={game.availPairs} skillScore={activeSkill} timerDisplay={timerDisplay} onPause={handlePause} isLandscape={true} />
          {boardEl}
          <ActionBar onHint={game.handleHint} onUndo={game.handleUndo} onShuffle={game.handleShuffle} canUndo={game.history.length>0} isLandscape={true} onPause={handlePause} />
        </div>
      )}

      {isPlaying && !isLandscape && (
        <div style={lay.portrait}>
          <HUD score={game.score} activeTiles={game.activeTiles.length} totalTiles={game.totalTiles} availPairs={game.availPairs} skillScore={activeSkill} timerDisplay={timerDisplay} onPause={handlePause} isLandscape={false} />
          {boardEl}
          <ActionBar onHint={game.handleHint} onUndo={game.handleUndo} onShuffle={game.handleShuffle} canUndo={game.history.length>0} isLandscape={false} />
        </div>
      )}

      {isPaused && <PauseMenu onResume={handleResume} onRestart={handleRestart} onMenu={handleGoToMenu} timerDisplay={timerDisplay} score={game.score} />}
      <ComboPopup combo={game.comboPopup} />
      <FlowAlert event={game.flowEvent} isPlaying={isPlaying} />
    </div>
  );
}

var lay = {
  root:       { width:"100%", height:"100%", display:"flex", flexDirection:"column", overflow:"hidden", position:"relative", background:"#000" },
  bg:         { position:"fixed", inset:0, background:"#000", zIndex:0, pointerEvents:"none" },
  glow1:      { position:"fixed", top:"-20%", left:"-10%", width:"60%", height:"60%", background:"radial-gradient(ellipse,rgba(255,107,0,0.12) 0%,transparent 70%)", zIndex:0, pointerEvents:"none" },
  glow2:      { position:"fixed", bottom:"-20%", right:"-10%", width:"60%", height:"60%", background:"radial-gradient(ellipse,rgba(0,229,255,0.08) 0%,transparent 70%)", zIndex:0, pointerEvents:"none" },
  portrait:   { display:"flex", flexDirection:"column", height:"100%", position:"relative", zIndex:1 },
  landscape:  { display:"flex", flexDirection:"row", height:"100%", position:"relative", zIndex:1 },
  boardArea:  { flex:1, minHeight:0, position:"relative", zIndex:1 },
  boardScroll:{ width:"100%", height:"100%", overflowX:"auto", overflowY:"auto", WebkitOverflowScrolling:"touch", display:"flex", alignItems:"center", justifyContent:"center", padding:"8px" },
};
