// Calculate the current streak of consecutive workout days ending at the most recent workout
module.exports = function calculateCurrentStreak(dates) {
  if (!dates.length) return 0;
  const sorted = dates.map(d => new Date(d)).sort((a, b) => a - b);
  let currentStreak = 1;
  for (let i = sorted.length - 1; i > 0; i--) {
    const diff = (sorted[i] - sorted[i - 1]) / (1000 * 60 * 60 * 24);
    if (diff === 1) {
      currentStreak++;
    } else if (diff > 1) {
      break;
    }
  }
  return currentStreak;
}; 