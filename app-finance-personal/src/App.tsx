import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import SplashScreen from "./pages/SplashScreen";
import Home from "./pages/Home";
import TransactionHistory from "./pages/TransactionHistory";
import Dashboard from "./pages/Dashboard";
import Layout from "./components/Layout";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<SplashScreen />} />
          <Route element={<Layout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/transactions" element={<TransactionHistory />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
