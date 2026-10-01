export const LEGACY_REQUIRED_SELECTORS = Object.freeze([
  '.command-bar', '.hero-stage', '.cyber-scene', '.roster-card.day',
  '.roster-card.night', '.roster-card.off', '.insights-panel',
  '#overviewNetwork', '#overviewMonthMatrix', '#timeline', '.live-pill'
]);

export function legacyShellContract(){
  return {
    selectors:[...LEGACY_REQUIRED_SELECTORS],
    labels:['Shift Command Center','DAY SHIFT','NIGHT SHIFT','OFF','TEAM NETWORK','MONTH MATRIX']
  };
}
