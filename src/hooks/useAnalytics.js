import { useRef, useCallback } from "react";
import { AnalyticsEngine } from "../analytics/AnalyticsEngine.js";
import { calculateSkillScore, blendSkillScore } from "../analytics/SkillScore.js";

export function useAnalytics(currentSkillScore, onSkillUpdate) {
  var engineRef = useRef(new AnalyticsEngine());

  var reset        = useCallback(function() { engineRef.current.reset(); }, []);
  var recordMove   = useCallback(function(k) { engineRef.current.recordMove(k); }, []);
  var recordMistake= useCallback(function() { engineRef.current.recordMistake(); }, []);
  var recordHint   = useCallback(function() { engineRef.current.recordHint(); }, []);
  var recordUndo   = useCallback(function() { engineRef.current.recordUndo(); }, []);
  var recordShuffle= useCallback(function() { engineRef.current.recordShuffle(); }, []);

  var recordResult = useCallback(function(result) {
    engineRef.current.recordResult(result);
    var newScore = calculateSkillScore(engineRef.current.session);
    var blended  = blendSkillScore(currentSkillScore, newScore);
    if (onSkillUpdate) onSkillUpdate(blended);
    return engineRef.current.getSnapshot();
  }, [currentSkillScore, onSkillUpdate]);

  var isStuck = useCallback(function() { return engineRef.current.isStuck(); }, []);

  return {
    engine: engineRef.current,
    reset, recordMove, recordMistake, recordHint,
    recordUndo, recordShuffle, recordResult, isStuck,
  };
}
