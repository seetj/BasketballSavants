export default function ratioCounter(countGames, playerLine, stats) {
  const lastDynamic = stats.slice(-countGames);
  const lastDynamicStats = lastDynamic?.map((item) => item.y) || [];
  const overCount = lastDynamicStats.filter((num) => num >= playerLine).length;
  const underCount = lastDynamicStats.filter((num) => num < playerLine).length;
  return `${overCount}-${underCount} ${Math.round(
    (overCount / countGames) * 100,
    2
  )}%`;
}
