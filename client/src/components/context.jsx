import React, { createContext, useState, useEffect } from "react";

export const DataProvider = ({ children }) => {
  const [data, setData] = useState(null);
  const [players, setPlayers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPlayerNames = async () => {
    try {
      const response = await fetch(
        "https://basketball-savants-api.vercel.app/stats/players/"
      );
      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        console.error(message);
        return;
      }
      const names = await response.json();
      setPlayers(names);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayerNames();
  }, []);

  // async function getAverageTen() {
  //   const response = await fetch("http://localhost:5050/stats/avglast10games/");
  //   if (!response.ok) {
  //     const message = `An error occurred: ${response.statusText}`;
  //     console.error(message);
  //     return;
  //   }
  //   const average = await response.json();
  //   setAverage(average);
  // }

  return (
    <DataContext.Provider value={{ data, players, loading, error }}>
      {children}
    </DataContext.Provider>
  );
};

export const DataContext = createContext();
