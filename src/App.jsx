import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Warehouses from "./pages/Warehouses";
import Movements from "./pages/Movements";
import Categories from "./pages/Categories";
import Stocks from "./pages/Stocks";
import Traceability from "./pages/Traceability";
import Alerts from "./pages/Alertes";
import Agents from "./pages/Agents";
import Settings from "./pages/Settings";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/produits" element={<Products />} />
          <Route path="/entrepot" element={<Warehouses />} />
          <Route path="/mouvements" element={<Movements />} />
          <Route path="/tracabilite" element={<Traceability />} />
          <Route path="/alertes" element={<Alerts />} />
          <Route path="/agents" element={<Agents />} />
          <Route path="/parametres" element={<Settings />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/stocks" element={<Stocks />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
