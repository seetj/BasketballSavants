import { DataProvider } from "./components/context";
import Graph from "./components/graph";
import Navbar from "./components/nav";
import Scoreboard from "./components/scores";
const App = () => {
  return (
    <DataProvider>
      <Scoreboard />
      <Navbar />
      <div class="flex content-center justify-center py-6">
      <Graph />
      </div>
    </DataProvider>
  );
};
export default App;
