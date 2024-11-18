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

  const customTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0]; // Access the data being hovered over
      return (
        <div
          style={{
            backgroundColor: "white",
            border: "1px solid #ccc",
            padding: "10px",
            borderRadius: "20px",
          }}
        >
          <p>{`Game Played: ${label}`}</p>
          <p>
            {`${selectedStat.label}: ${data.value}`} vs {data.payload.Opp}
          </p>{" "}
          {/* acryonmon is a placeholder for now*/}
        </div>
      );
    }
    return null;
  };
  const CustomBar = (props) => {
    const { x, y, width, height, payload, index } = props;

    // Skip rendering if the value is 0
    if (payload.y === 0) {
      return null;
    }

    const color = payload.y >= playerLine ? "green" : "red"; // Dynamic color logic
    const cornerRadius = 20; // Radius for the top corners

    return (
      <>
        {/* Custom SVG Path for Rounded Top Corners */}
        <path
          d={`
            M${x},${y + cornerRadius}
            a${cornerRadius},${cornerRadius} 0 0 1 ${cornerRadius},-${cornerRadius}
            h${width - 2 * cornerRadius}
            a${cornerRadius},${cornerRadius} 0 0 1 ${cornerRadius},${cornerRadius}
            v${height - cornerRadius}
            h-${width}
            z
          `}
          fill={color}
        />
        {/* Render the custom label */}
        {renderCustomBarLabel({ x, y, width, index })}
      </>
    );
  };

  const maxValue =
    stats && stats.length > 0 ? Math.max(...stats.map((item) => item.y)) : 10;
  const ceiling = Math.ceil(maxValue / 10) * 10;
  const ticks = Array.from({ length: ceiling / 10 + 1 }, (_, i) => i * 10);

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

      <div
        className="graphContainer justify-center py-10"
        style={{ backgroundColor: "#f0f0f0" }}
      >
        <BarChart
          width={1080}
          height={450}
          data={stats}
          margin={{ top: 20, right: 30, left: 20, bottom: 30 }} // Increased bottom margin
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
              fontFamily: "sans-serif",
              fill: "#333",
            }}
            ticks={ticks} // Dynamically generated ticks
            domain={[0, ceiling]}
          />
          <Tooltip content={customTooltip} />
          <Bar
          dataKey="y"
          shape={<CustomBar />} // Use the CustomBar component
          />
          <ReferenceLine y={playerLine} stroke="red" strokeDasharray="3 3" />
        </BarChart>
      </div>
    </div>
  );
}