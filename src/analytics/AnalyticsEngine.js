export function AnalyticsEngine() {
this.session = this._fresh();
this.heatmap = {};
this.consecutiveMistakes = 0;
this._lastMove = Date.now();
}

AnalyticsEngine.prototype._fresh = function() {
return {
moves:0, mistakes:0, hintsUsed:0, undosUsed:0, shufflesUsed:0,
moveTimes:[], avgMoveTime:0, result:null, startTime:Date.now(), endTime:null
};
};

AnalyticsEngine.prototype.reset = function() {
this.session = this._fresh();
this.heatmap = {};
this.consecutiveMistakes = 0;
this._lastMove = Date.now();
};

AnalyticsEngine.prototype.recordMove = function(key) {
var now = Date.now();
this.session.moveTimes.push(now - this._lastMove);
this._lastMove = now;
this.session.moves++;
this.session.avgMoveTime = this.session.moveTimes.reduce(
function(a,b){return a+b;},0
) / this.session.moveTimes.length;
this.consecutiveMistakes = 0;
if (key) this.heatmap[key] = (this.heatmap[key] || 0) + 1;
};

AnalyticsEngine.prototype.recordMistake = function() {
this.session.mistakes++;
this.consecutiveMistakes++;
};

AnalyticsEngine.prototype.recordHint = function() {
this.session.hintsUsed++;
};

AnalyticsEngine.prototype.recordUndo = function() {
this.session.undosUsed++;
};

AnalyticsEngine.prototype.recordShuffle = function() {
this.session.shufflesUsed++;
};

AnalyticsEngine.prototype.recordResult = function(r) {
this.session.result = r;
this.session.endTime = Date.now();
};

AnalyticsEngine.prototype.isStuck = function() {
return Date.now() - this._lastMove > 28000 || this.consecutiveMistakes >= 3;
};

AnalyticsEngine.prototype.getSnapshot = function() {
return Object.assign({}, this.session, { heatmap: Object.assign({}, this.heatmap) });
};