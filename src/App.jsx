import { useCallback, useMemo, useState, useEffect, useRef } from "react";
import { useGameState, STATUS } from "./hooks/useGameState.js";
import { usePersistence } from "./hooks/usePersistence.js";
import { buildSummary } from "./systems/Scoring.js";
import { Board } from "./components/Board.jsx";
import { HUD, ActionBar } from "./components/HUD.jsx";
import { MainMenu, WinScreen, LostScreen } from "./components/Menu.jsx";
import { ComboPopup, PauseMenu, SyncDot } from "./components/Overlays.jsx";
import { Leaderboard } from "./components/Leaderboard.jsx";
import { Settings } from "./components/Settings.jsx";
import { Audio } from "./systems/Audio.js";
import { getTheme, loadTheme, saveTheme } from "./systems/Themes.js";

var DIFF_SCORES = { easy:15, medium:45, hard:72, god:92 };

function useOrientation() {
  var init = window.innerWidth > window.innerHeight;
  var s = useState(init); var set = s[1];
  useEffect(function() {
    var h = function() { set(window.innerWidth > window.innerHeight); };
    window.addEventListener("resize", h);
    window.addEventListener("orientationchange", h);
    return function() {
      window.removeEventListener("resize", h);
      window.removeEventListener("orientationchange", h);
    };
  }, []);
  return s[0];
}

export default function App() {
  var pers = usePersistence();
  var player        = pers.player;
  var syncStatus    = pers.syncStatus;
  var persistPlayer = pers.persistPlayer;
  var persistSession= pers.persistSession;
  var updateName    = pers.updateName;

  var a1 = useState(false);          var isPaused    = a1[0]; var setIsPaused    = a1[1];
  var a2 = useState("turtle");       var savedLayout = a2[0]; var setSavedLayout = a2[1];
  var a3 = useState(0);              var timerSecs   = a3[0]; var setTimerSecs   = a3[1];
  var a4 = useState(false);          var timerOn     = a4[0]; var setTimerOn     = a4[1];
  var a5 = useState(false);          var showMenu    = a5[0]; var setShowMenu    = a5[1];
  var a6 = useState(false);          var showLB      = a6[0]; var setShowLB      = a6[1];
  var a7 = useState(false);          var showSet     = a7[0]; var setShowSet     = a7[1];
  var a8 = useState(72);             var skill       = a8[0]; var setSkill       = a8[1];
  var a9 = useState(loadTheme());    var themeId     = a9[0]; var setThemeId     = a9[1];

  var theme = getTheme(themeId);
  var timerRef = useRef(null);
  var landscape = useOrientation();

  var handleTheme = useCallback(function(id) {
    setThemeId(id); saveTheme(id);
  }, []);

  var handleSessionEnd = useCallback(async function(session, score, result) {
    var newHigh = Math.max(player.highScore || 0, score);
    persistPlayer({
      highScore:  newHigh,
      totalGames: (player.totalGames || 0) + 1,
      totalWins:  (player.totalWins  || 0) + (result === "win" ? 1 : 0),
    });
    setTimerOn(false);
    await persistSession(session, score, result);
  }, [player, persistPlayer, persistSession]);

  var game = useGameState(skill, handleSessionEnd);

  var summary = useMemo(function() {
    if (game.status === STATUS.WON || game.status === STATUS.LOST) {
      return buildSummary(game.score, game.session, game.tiles);
    }
    return null;
  }, [game.status]);

  useEffect(function() {
    if (timerOn) {
      timerRef.current = setInterval(function() {
        setTimerSecs(function(s) { return s + 1; });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return function() { clearInterval(timerRef.current); };
  }, [timerOn]);

  var mm  = String(Math.floor(timerSecs / 60)).padStart(2, "0");
  var ss2 = String(timerSecs % 60).padStart(2, "0");
  var timer = mm + ":" + ss2;

  var medal = null;
  if      (timerSecs < 120) medal = { label:"GOLD",   color:"#fbbf24" };
  else if (timerSecs < 240) medal = { label:"SILVER", color:"#94a3b8" };
  else if (timerSecs < 360) medal = { label:"BRONZE", color:"#cd7c2f" };

  var start = useCallback(function(lid, diff) {
    Audio.unlock();
    setSkill(DIFF_SCORES[diff] || 72);
    setSavedLayout(lid || "turtle");
    setTimerSecs(0);
    setTimerOn(true);
    setIsPaused(false);
    setShowMenu(false);
    setShowLB(false);
    setShowSet(false);
    game.startGame(lid);
  }, [game]);

  var cont = useCallback(function() {
    Audio.unlock();
    setTimerSecs(0); setTimerOn(true); setIsPaused(false);
    setShowMenu(false); setShowLB(false); setShowSet(false);
    game.startGame(savedLayout);
  }, [game, savedLayout]);

  var restart = useCallback(function() {
    setTimerSecs(0); setTimerOn(true); setIsPaused(false);
    setShowMenu(false); setShowLB(false); setShowSet(false);
    game.startGame(savedLayout);
  }, [game, savedLayout]);

  var pause   = useCallback(function() { setIsPaused(true);  setTimerOn(false); }, []);
  var resume  = useCallback(function() { setIsPaused(false); setTimerOn(true);  }, []);
  var toMenu  = useCallback(function() {
    setIsPaused(false); setTimerOn(false); setTimerSecs(0); setShowMenu(true);
  }, []);

  var playing = game.status === STATUS.PLAYING && !showMenu && !showLB && !showSet;

  var rootStyle = {
    width:    "100%",
    height:   "100%",
    overflow: "hidden",
    position: "relative",
    background: theme.bg,
  };

  var glow1Style = {
    position:   "fixed",
    top:        "-20%",
    left:       "-10%",
    width:      "60%",
    height:     "60%",
    background: "radial-gradient(ellipse," + theme.glow1 + " 0%,transparent 70%)",
    zIndex:     0,
    pointerEvents: "none",
  };

  var glow2Style = {
    position:   "fixed",
    bottom:     "-20%",
    right:      "-10%",
    width:      "60%",
    height:     "60%",
    background: "radial-gradient(ellipse," + theme.glow2 + " 0%,transparent 70%)",
    zIndex:     0,
    pointerEvents: "none",
  };

  var colStyle   = { position:"absolute", inset:0, display:"flex", flexDirection:"column", zIndex:1 };
  var rowStyle   = { position:"absolute", inset:0, display:"flex", flexDirection:"row", zIndex:1 };
  var boardStyle = { flex:1, minHeight:0, minWidth:0, position:"relative" };

  return (
    <div style={rootStyle}>
      <div style={glow1Style} />
      <div style={glow2Style} />
      <SyncDot status={syncStatus} />

      {showLB  && <Leaderboard onClose={function() { setShowLB(false); }} />}
      {showSet && (
        <Settings
          displayName={player.displayName || "Speler"}
          skillScore={player.skillScore || 50}
          onChangeName={updateName}
          onClose={function() { setShowSet(false); }}
          currentTheme={themeId}
          onThemeChange={handleTheme}
        />
      )}

      {(game.status === STATUS.MENU || showMenu) && !showLB && !showSet && (
        <MainMenu
          skillScore={player.skillScore || 50}
          highScore={player.highScore || 0}
          displayName={player.displayName || "Speler"}
          onStart={start}
          onContinue={cont}
          onChangeName={updateName}
          onLeaderboard={function() { setShowLB(true); }}
          onSettings={function()    { setShowSet(true); }}
          theme={theme}
        />
      )}

      {game.status === STATUS.WON && !showMenu && !showLB && !showSet && (
        <WinScreen
          score={game.score}
          summary={summary || {}}
          timerSecs={timerSecs}
          medal={medal}
          onRestart={restart}
          onMenu={toMenu}
        />
      )}
      {game.status === STATUS.LOST && !showMenu && !showLB && !showSet && (
        <LostScreen
          score={game.score}
          summary={summary || {}}
          onRestart={restart}
          onMenu={toMenu}
        />
      )}

      {playing && landscape && (
        <div style={rowStyle}>
          <HUD
            score={game.score}
            activeTiles={game.activeTiles.length}
            totalTiles={game.totalTiles}
            availPairs={game.availPairs}
            skillScore={skill}
            timer={timer}
            onPause={pause}
            landscape={true}
            theme={theme}
          />
          <div style={boardStyle}>
            <Board
              tiles={game.tiles}
              selected={game.selected}
              hintIds={game.hintIds}
              matchIds={game.matchIds}
              mistakeId={game.mistakeId}
              glowIds={game.glowIds}
              onTileClick={game.handleClick}
            />
          </div>
          <ActionBar
            onHint={game.handleHint}
            onUndo={game.handleUndo}
            onShuffle={game.handleShuffle}
            canUndo={game.history.length > 0}
            landscape={true}
            onPause={pause}
          />
        </div>
      )}

      {playing && !landscape && (
        <div style={colStyle}>
          <HUD
            score={game.score}
            activeTiles={game.activeTiles.length}
            totalTiles={game.totalTiles}
            availPairs={game.availPairs}
            skillScore={skill}
            timer={timer}
            onPause={pause}
            landscape={false}
            theme={theme}
          />
          <div style={boardStyle}>
            <Board
              tiles={game.tiles}
              selected={game.selected}
              hintIds={game.hintIds}
              matchIds={game.matchIds}
              mistakeId={game.mistakeId}
              glowIds={game.glowIds}
              onTileClick={game.handleClick}
            />
          </div>
          <ActionBar
            onHint={game.handleHint}
            onUndo={game.handleUndo}
            onShuffle={game.handleShuffle}
            canUndo={game.history.length > 0}
            landscape={false}
          />
        </div>
      )}

      {isPaused && (
        <PauseMenu
          onResume={resume}
          onRestart={restart}
          onMenu={toMenu}
          timer={timer}
          score={game.score}
        />
      )}
      <ComboPopup combo={game.comboPopup} />
    </div>
  );
} 
