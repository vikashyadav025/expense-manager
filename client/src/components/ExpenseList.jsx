import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { format } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { deleteExpense, getExpenses } from "../services/expenseService";
import { getCategories } from "../services/categoryService";
import { getItems } from "../services/itemService";

const ExpenseList = () => {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [filters, setFilters] = useState({
    category: "",
    item: "",
    date: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [expensesResponse, categoriesResponse, itemsResponse] =
          await Promise.all([getExpenses(), getCategories(), getItems()]);

        // Ensure we always get arrays
        const expensesData = Array.isArray(expensesResponse)
          ? expensesResponse
          : expensesResponse?.data || [];

        const categoriesData = Array.isArray(categoriesResponse)
          ? categoriesResponse
          : categoriesResponse?.data || [];

        const itemsData = Array.isArray(itemsResponse)
          ? itemsResponse
          : itemsResponse?.data || [];

        setExpenses(expensesData);
        setFilteredExpenses(expensesData);
        setCategories(categoriesData);
        setItems(itemsData);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error(error.message || "Failed to load expenses");
        setExpenses([]);
        setFilteredExpenses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter expenses based on selected filters
  useEffect(() => {
    let filtered = [...expenses]; // Create a new array to avoid mutation

    if (filters.category) {
      filtered = filtered.filter(
        (expense) => expense.category?._id === filters.category
      );
    }

    if (filters.item) {
      filtered = filtered.filter(
        (expense) => expense.item?._id === filters.item
      );
    }

    if (filters.date) {
      const filterDate = format(filters.date, "yyyy-MM-dd");
      filtered = filtered.filter(
        (expense) => format(new Date(expense.date), "yyyy-MM-dd") === filterDate
      );
    }

    setFilteredExpenses(filtered);
  }, [filters, expenses]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateFilterChange = (date) => {
    setFilters((prev) => ({
      ...prev,
      date,
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: "",
      item: "",
      date: null,
    });
  };

  const handleDelete = async (id) => {
    try {
      await deleteExpense(id);
      const updatedExpenses = expenses.filter((expense) => expense._id !== id);
      setExpenses(updatedExpenses);
      toast.success("Expense deleted successfully");
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Calculate total amount with safeguards
  const totalAmount = Array.isArray(filteredExpenses)
    ? filteredExpenses.reduce(
        (total, expense) => total + (Number(expense.amount) || 0),
        0
      )
    : 0;

  if (loading) {
    return <div className="text-center p-4">Loading expenses...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Filter Section */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-md font-medium mb-3">Filter Expenses</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="form-label">Category</label>
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="form-select"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label">Item</label>
            <select
              name="item"
              value={filters.item}
              onChange={handleFilterChange}
              className="form-select"
            >
              <option value="">All Items</option>
              {items.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label">Date</label>
            <DatePicker
              selected={filters.date}
              onChange={handleDateFilterChange}
              className="form-input"
              placeholderText="Select date"
              isClearable
            />
          </div>

          <div className="flex items-end">
            <button onClick={clearFilters} className="btn btn-secondary w-full">
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="bg-blue-50 p-3 rounded-lg">
        <p className="text-sm text-blue-800">
          Showing {filteredExpenses.length} of {expenses.length} expenses
          {(filters.category || filters.item || filters.date) && " (filtered)"}
        </p>
      </div>

      {/* Expense Table */}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Item</th>
              <th>Amount</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(filteredExpenses) &&
              filteredExpenses.map((expense) => (
                <tr key={expense._id}>
                  <td>{format(new Date(expense.date), "MMM dd, yyyy")}</td>
                  <td>{expense.category?.name}</td>
                  <td>{expense.item?.name}</td>
                  <td>Rs. {Number(expense.amount).toFixed(2)}/-</td>
                  <td>{expense.description}</td>
                  <td>
                    <button
                      onClick={() => handleDelete(expense._id)}
                      className="btn btn-danger"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            {!Array.isArray(filteredExpenses) ||
              (filteredExpenses.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center text-gray-500 py-4">
                    No expenses found
                  </td>
                </tr>
              ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-50 font-semibold">
              <td colSpan="3" className="text-right">
                Total:
              </td>
              <td>Rs. {totalAmount.toFixed(2)}/-</td>
              <td colSpan="2"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default ExpenseList;
