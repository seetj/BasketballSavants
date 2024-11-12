import Select from "react-select";
import { useEffect, useState } from "react";
export default function Scoreboard() {
  const dates = [
    { value: "2022-10-18", label: "2022-10-18" },
    { value: "2022-10-17", label: "2022-10-17" },
    { value: "2022-11-16", label: "2022-11-16" },
  ];

  const [selectedDate, setSelectedDate] = useState(dates[0]);
  const [results, setResults] = useState(null);

  const handleDateChange = (selectedDate) => {
    setSelectedDate(selectedDate);
  };
  const fetchResults = async () => {
    if (!selectedDate) return;
    const response = await fetch(
      `http://localhost:5050/boxscores/${selectedDate.value}`
    );
    if (!response.ok) {
      const message = `An error occurred: ${response.statusText}`;
      console.log(message);
      return;
    }
    const games = await response.json();
    setResults(games);
  };

  useEffect(() => {
    fetchResults();
  }, [selectedDate]);

  return (
    <div className="bg-indigo-700 border-slate-100">
      <div className=" flex items-center bg-[#F8F9FA]">
        <span className="flex items-center text-black text-sm text-semibold p-2">
          <Select
            className="z50 w-36"
            options={dates}
            value={selectedDate}
            onChange={handleDateChange}
          />
        </span>
        <div className="overflow-y-auto">
          <div className="flex min-w-full">
            {results && results.length > 0 ? (
              results.map((game, index) => (
                <div
                  key={index}
                  className="flex flex-col items-start bg-white p-4 border-x min-w-[150px]"
                >
                  <div>
                    <span className="text-sm ">
                      {game.HOME_ACRONYM} {game.HOME_PTS}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm ">
                      {game.VISITOR_ACRONYM} {game.VISITOR_PTS}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-2 flex flex-col items-center">
                <span>No games on selected date</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
