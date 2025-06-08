import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard/expenses");
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div
      className="container"
      style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}
    >
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Welcome to Expense Manager</h1>
        <p className="text-gray-600">
          Use the navigation above to manage your expenses.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
