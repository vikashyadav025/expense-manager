import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    { name: "Expenses", path: "/dashboard/expenses" },
    { name: "Categories", path: "/dashboard/categories" },
    { name: "Items", path: "/dashboard/items" },
    { name: "Reports", path: "/dashboard/reports" },
  ];

  return (
    <header className="header">
      <div className="container">
        <Link to="/dashboard" className="text-xl font-bold text-gray-900">
          Expense Manager
        </Link>

        {/* Navigation Menu - Only show when user is logged in */}
        {user && (
          <nav className="navbar-nav">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`nav-link ${
                  location.pathname === item.path ? "active" : ""
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        )}

        {/* User Section */}
        <div className="user-section">
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Hello, {user.name}</span>
              <button onClick={handleLogout} className="btn btn-danger">
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/login" className="btn btn-primary">
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
