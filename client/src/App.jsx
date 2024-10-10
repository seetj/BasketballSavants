import { DataProvider } from "./components/context";
import Graph from "./components/graph";
import Navbar from "./components/nav";
import PlayerLine from "./components/playerLineDropdown";
//import Example from "./components/header";
const App = () => {
  return (
    <DataProvider>
      <Navbar />
      <div class="flex content-center justify-center py-6">
        <Graph />
      </div>
    </DataProvider>
  );
};
export default App;
