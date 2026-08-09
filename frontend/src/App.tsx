import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Login from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import Products from "./pages/Products";
import Challans from "./pages/Challans";
import Layout from "./components/Layout";
import CustomerDetail from "./pages/CustomerDetails";
import StockMovements from "./pages/StockMovement";
import ChallanDetail from "./pages/ChallanDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Login />}
        />

        <Route element={<Layout />}>
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/customers"
            element={<Customers />}
          />

          <Route
            path="/products"
            element={<Products />}
          />

          <Route
            path="/challans"
            element={<Challans />}
          />

          <Route
          path="/customers/:id"
          element={<CustomerDetail />}
          />

          <Route
            path="/stock-movements"
            element={<StockMovements />}
          />

          <Route
            path="/challans/:id"
            element={<ChallanDetail />}
          />


        </Route>


      </Routes>
    </BrowserRouter>
  );
}

export default App;