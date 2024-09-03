import { useState, useContext, useEffect } from "react";
import { DataContext } from "./context";
import Select from "react-select";
import PlayerName from "./playerDropdown";
import optionsStat from "./labels";
import PlayerLine from "./playerLineDropdown";
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
  const { players, loading, error } = useContext(DataContext);
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const fetchStats = async () => {
    const response = await fetch(
      `http://localhost:5050/stats/last10games/${selectedPlayer.value}/`
    );
    if (!response.ok) {
      const message = `An error occurred: ${response.statusText}`;
      console.error(message);
      return;
    }
    const stats = await response.json();
    console.log(stats);
    setPlayerStats(stats);
  };

  useEffect(() => {
    fetchStats();
  }, [selectedPlayer]);

  const [selectedStat, setSelectedStat] = useState(optionsStat[0]);
  const [playerStats, setPlayerStats] = useState(null);
  const [playerLine, setPlayerLine] = useState(0.5);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const handlePlayerChange = (player) => {
    setSelectedPlayer(player);
  };

  const handlePlayerLine = (number) => {
    setPlayerLine(number);
  };
  const stats = playerStats?.map((item) => ({
    x: item.Date,
    y: item[`${selectedStat.value}`],
    Opp: item.Opp,
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
    <div>
      <div>
        <h1>Select a Stat</h1>
        <Select
          options={optionsStat}
          value={selectedStat}
          onChange={(e) => setSelectedStat(e)}
        />
        <h1>Select a Player</h1>
        <PlayerName onPlayerChange={handlePlayerChange} />
        <h1>Player Line</h1>
        <PlayerLine onLineChange={handlePlayerLine} />
      </div>
      <BarChart width={600} height={300} data={stats}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="x" />
        <YAxis domain={[0, "dataMax + 2"]} />
        <Tooltip />
        <Bar dataKey="y" fill="#8884d8" label={renderCustomBarLabel} />
        <ReferenceLine
          // y={average[0].avgPoints}
          stroke="red"
          strokeDasharray="3 3"
          label="Average"
        />
      </BarChart>
    </div>
  );
}
