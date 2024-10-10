import Select from "react-select";

export default function PlayerLine({ playerLine, setPlayerLine }) {
  const handleIncrement = () => {
    setPlayerLine((prevPlayerLine) => Math.min(prevPlayerLine + 0.5, 100));
  };

  const handleDecrement = () => {
    setPlayerLine((prevPlayerLine) => Math.min(prevPlayerLine - 0.5, 0));
  };

  const options = Array.from({ length: 201 }, (_, index) => ({
    value: (index / 2).toFixed(1),
    label: (index / 2).toFixed(1),
  }));

  return (
    <div className="mx-auto flex items-center space-x-1  w-full">
      <div className="w-4/5">
        <Select
          options={options}
          value={options.find((option) => option.value == playerLine)}
          isSearchable
          onChange={(e) => setPlayerLine(e.value)}
        />
      </div>
      <div className="flex justify-center items-center w-1/5">
        <button
          class="border bold border-gray-400 rounded size-8 px-2 py-1"
          onClick={handleDecrement}
        >
          -
        </button>
        <button
          class="border bold border-gray-400 rounded size-8 px-2 py-1"
          onClick={handleIncrement}
        >
          +
        </button>
      </div>
    </div>
  );
}
