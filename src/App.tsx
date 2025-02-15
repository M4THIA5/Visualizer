import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import GraphVisualizer from "./components/GraphVisualizer";
import AddNodeForm from "./components/AddNodeForm";

export const API_URL = "http://localhost:3000";

function App() {
  return (
    <Router>
      <div className="App">
        <h1>Visualisation Neo4j</h1>
        <nav>
          <Link to="/">Voir le graphique</Link>
          <Link to="/add-node">Ajouter un nœud</Link>
        </nav>

        <Routes>
          <Route path="/" element={<GraphVisualizer />} />
          <Route path="/add-node" element={<AddNodeForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
