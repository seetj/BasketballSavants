import { useState, useContext, useEffect } from "react";
import { DataContext } from "./context";
import Select from "react-select";
import PlayerName from "./playerDropdown";
import optionsStat from "./labels";
import PlayerLine from "./playerLineDropdown";
import ratioCounter from "./ratioCounter";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from "recharts";

export default function Graph() {
  const { loading, error } = useContext(DataContext);
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const fetchlast10 = async () => {
    if (!selectedPlayer) return;
    const response = await fetch(
      `http://localhost:5050/stats/last10games/${selectedPlayer.value}/`
    );
    if (!response.ok) {
      const message = `An error occurred: ${response.statusText}`;
      console.error(message);
      return;
    }
    const stats = await response.json();
    setPlayerStats(stats[0].games_played);
  };

  useEffect(() => {
    fetchlast10();
  }, [selectedPlayer]);

  const [selectedStat, setSelectedStat] = useState(optionsStat[0]);
  const [playerStats, setPlayerStats] = useState(null);
  const [playerLine, setPlayerLine] = useState(0.5);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const handlePlayerChange = (player) => {
    setSelectedPlayer(player);
  };

  const stats = playerStats?.map((item) => ({
    x: item.date,
    y: item.stats[`${selectedStat.value}`],
    Opp: item.opponent,
  }));

  const renderCustomBarLabel = ({ x, y, width, index }) => {
    const opponent = stats[index]?.Opp;
    return (
      <text
        x={x + width / 2}
        y={y}
        fill="#666"
        textAnchor="middle"
        dy={-6}
      >{`vs  ${opponent}`}</text>
    );
  };

  return (
    <div className="graphContainer px-20 py-2 items-center">
      <div className="dropdownContainer mx-auto flex justify-between space-x-4">
        <div className="statContainer w-1/3">
          <h1>Select a Stat:</h1>
          <Select
            options={optionsStat}
            value={selectedStat}
            onChange={(e) => setSelectedStat(e)}
          />
        </div>
        <div className="playerContainer w-1/3">
          <h1>Select a Player:</h1>
          <PlayerName onPlayerChange={handlePlayerChange} />
        </div>
        <div className="lineContainer w-1/3">
          <h1>Player Line:</h1>
          <PlayerLine playerLine={playerLine} setPlayerLine={setPlayerLine} />
        </div>
      </div>
      {stats ? (
        <div className="statOdds flex flex-col py-2 ">
          <text className="pt-2">
            <b>
              {" "}
              O/U {playerLine} {selectedStat.label}:{" "}
            </b>
            Last 3: {ratioCounter(3, playerLine, stats)} | L5:{" "}
            {ratioCounter(5, playerLine, stats)} | L10:{" "}
            {ratioCounter(10, playerLine, stats)}
          </text>
          <text className="pt-2">
            <b>Implied Odds: </b>
            Last 3: 1.50 | L5: $2.50 | L10: $3.33
          </text>
        </div>
      ) : (
        <div>
          <p className="flex flex-col py-2">Select a player to show odds</p>
        </div>
      )}

      <div className="graphContainer justify-center py-10" style={{ backgroundColor: "#f0f0f0" }}>
        <BarChart
          width={1080}
          height={450}
          data={stats}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }} // Increased bottom margin
        >
          <XAxis
            dataKey="x"
            strokeWidth={4}
            tick={{
              angle: -45, // Diagonal tilt
              dx: -10, // Horizontal offset
              dy: 20, // Vertical offset
              fontSize: 14,
              fontFamily: "sans-serif",
              fill: "#333",
            }}
          />
          <YAxis 
          strokeWidth={4}
          tick={{
          fontSize: 16,
          fontFamily: 'sans-serif',
          fill: '#333',
        }} />
          <Tooltip />
          <Bar
            dataKey="y"
            fill="#303F9F"
            radius={[20, 20, 0, 0]}
            label={renderCustomBarLabel}
          />
          <ReferenceLine y={playerLine} stroke="red" strokeDasharray="3 3" />
        </BarChart>
      </div>
    </div>
  );
}
