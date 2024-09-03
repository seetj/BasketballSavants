import { useState } from "react";
import Select from "react-select";

export default function PlayerLine({
  onLineChange,
  playerLine,
  setPlayerLine,
}) {
  const handleIncrement = () => {
    setPlayerLine((playerLine) => prevPlayerLine + 0.5);
  };

  const handleDecrement = () => {
    setPlayerLine((playerLine) => prevplayerLine - 0.5);
  };

  return (
    <div>
      <Select options={playerLine} value={playerLine} />
      <div
        style={{ marginTop: "10px", display: "flex", justifyContent: "center" }}
      >
        <button onClick={handleDecrement}>-</button>
        <button onClick={handleIncrement}>+</button>
      </div>
    </div>
  );
}
