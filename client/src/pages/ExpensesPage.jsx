import ExpenseForm from "../components/ExpenseForm.jsx";
import ExpenseList from "../components/ExpenseList.jsx";

const ExpensesPage = () => {
  return (
    <div
      className="container"
      style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="card">
            <h2 className="text-lg font-medium mb-4">Add New Expense</h2>
            <ExpenseForm />
          </div>
        </div>
        <div className="md:col-span-2">
          <div className="card">
            <h2 className="text-lg font-medium mb-4">Recent Expenses</h2>
            <ExpenseList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpensesPage;
