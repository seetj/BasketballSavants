import { useState } from "react";
import Select from "react-select";

export default function PlayerLine({ playerLine, setPlayerLine }) {
  const handleIncrement = () => {
    setPlayerLine((prevPlayerLine) => prevPlayerLine + 0.5);
  };

  const handleDecrement = () => {
    setPlayerLine((prevPlayerLine) => prevPlayerLine - 0.5);
  };

  const options = [
    {
      value: playerLine,
      label: `${playerLine}`,
    },
  ];

  return (
    <div>
      <Select options={options} value={options[0]} />
      <div
        style={{ marginTop: "10px", display: "flex", justifyContent: "center" }}
      >
        <button onClick={handleDecrement}>-</button>
        <button onClick={handleIncrement}>+</button>
      </div>
    </div>
  );
}
