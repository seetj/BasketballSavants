import { useContext } from "react";
import { DataContext } from "./context";
import Select from "react-select";

export default function PlayerName({ onPlayerChange, selectedPlayer }) {
  const { players, loading, error } = useContext(DataContext);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const playerNames = players.map((item) => ({
    value: item.name,
    label: item.name,
  }));
  return (
    <div>
      <Select
        options={playerNames}
        value={selectedPlayer}
        onChange={onPlayerChange}
        isSearchable
      />
    </div>
  );
}
