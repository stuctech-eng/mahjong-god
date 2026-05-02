export var SUITS = {
  CHAR: "char", BAM: "bam", CIRC: "circ",
  WIND: "wind", DRAGON: "dragon", FLOWER: "flower", SEASON: "season",
};

export function getSuitColor(suit) {
  var map = { char:"#c0392b", bam:"#1a7a3a", circ:"#1a5276", wind:"#6c3483", dragon:"#c0392b", flower:"#d35400", season:"#117a65" };
  return map[suit] || "#333";
}
