import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyOTP from "./pages/VerifyOTP";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";

function App() {
  const { token } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen">
      <Routes>
        <Route
          path="/login"
          element={!token ? <Login /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/register"
          element={!token ? <Register /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/verify"
          element={!token ? <VerifyOTP /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/dashboard"
          element={token ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/chat/:conversationId"
          element={token ? <Chat /> : <Navigate to="/login" />}
        />
        <Route
          path="/"
          element={<Navigate to={token ? "/dashboard" : "/login"} />}
        />
      </Routes>
    </div>
  );
}

export default App;
