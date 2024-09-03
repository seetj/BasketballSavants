import "./App.css";
import { DataProvider } from "./components/context";
import Graph from "./components/graph";
import PlayerLine from "./components/playerLineDropdown";

const App = () => {
  return (
    <DataProvider>
      <div className="w-full p-6">
        <Graph />
      </div>
    </DataProvider>
  );
};
export default App;
