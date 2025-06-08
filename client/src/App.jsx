import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Dashboard from "./pages/Dashboard.jsx";
import ExpensesPage from "./pages/ExpensesPage.jsx";
import CategoriesPage from "./pages/CategoriesPage.jsx";
import ItemsPage from "./pages/ItemsPage.jsx";
import ReportsPage from "./pages/ReportsPage.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Header from "./components/Header.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Header />
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* <Route element={<PrivateRoute />}> */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/expenses" element={<ExpensesPage />} />
            <Route path="/dashboard/categories" element={<CategoriesPage />} />
            <Route path="/dashboard/items" element={<ItemsPage />} />
            <Route path="/dashboard/reports" element={<ReportsPage />} />
            {/* </Route> */}
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
