import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useAuth } from "../context/AuthContext.jsx";
import { createExpense } from "../services/expenseService";
import { getCategories } from "../services/categoryService";
import { getItems } from "../services/itemService";

const ExpenseForm = ({ onExpenseAdded }) => {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [formData, setFormData] = useState({
    category: "",
    item: "",
    amount: "",
    description: "",
    date: new Date(),
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [categoriesResponse, itemsResponse] = await Promise.all([
          getCategories(),
          getItems(),
        ]);

        // Ensure we have arrays even if the response structure changes
        const categoriesData = Array.isArray(categoriesResponse)
          ? categoriesResponse
          : categoriesResponse?.data || [];

        const itemsData = Array.isArray(itemsResponse)
          ? itemsResponse
          : itemsResponse?.data || [];

        setCategories(categoriesData);
        setAllItems(itemsData);
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error(error.message || "Failed to load form data");
        setCategories([]);
        setAllItems([]);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  // Filter items based on selected category
  useEffect(() => {
    if (formData.category) {
      const itemsInCategory = allItems.filter(
        (item) =>
          item.category?._id === formData.category ||
          item.category === formData.category
      );
      setFilteredItems(itemsInCategory);

      // Clear item selection if current item is not in the selected category
      if (
        formData.item &&
        !itemsInCategory.some((item) => item._id === formData.item)
      ) {
        setFormData((prev) => ({ ...prev, item: "" }));
      }
    } else {
      setFilteredItems([]);
      setFormData((prev) => ({ ...prev, item: "" }));
    }
  }, [formData.category, allItems]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({
      ...prev,
      date,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const expense = await createExpense({
        ...formData,
        amount: parseFloat(formData.amount),
      });
      toast.success("Expense added successfully");
      setFormData({
        category: "",
        item: "",
        amount: "",
        description: "",
        date: new Date(),
      });
      onExpenseAdded?.(expense);
    } catch (error) {
      console.error("Submit error:", error);
      toast.error(error.message || "Failed to add expense");
    }
  };

  if (loading) {
    return <div className="text-center p-4">Loading form data...</div>;
  }

  if (!categories.length) {
    return (
      <div className="alert alert-warning">
        <h4 className="font-medium text-amber-800">No Categories Found</h4>
        <p className="text-amber-700 mt-1">
          Please create categories first before adding expenses.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="form-group">
        <label className="form-label">Category *</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="form-select"
          required
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Item *</label>
        <select
          name="item"
          value={formData.item}
          onChange={handleChange}
          className="form-select"
          required
          disabled={!formData.category}
        >
          <option value="">
            {!formData.category
              ? "Select a category first"
              : filteredItems.length === 0
              ? "No items in this category"
              : "Select an item"}
          </option>
          {filteredItems.map((item) => (
            <option key={item._id} value={item._id}>
              {item.name}
            </option>
          ))}
        </select>
        {formData.category && filteredItems.length === 0 && (
          <p className="text-sm text-amber-600 mt-1">
            No items found in selected category. Please add items to this
            category first.
          </p>
        )}
      </div>

      <div className="form-group">
        <label className="form-label">Amount *</label>
        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          className="form-input"
          min="0"
          step="0.01"
          placeholder="0.00"
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="form-textarea"
          placeholder="Optional notes about this expense..."
        />
      </div>

      <div className="form-group">
        <label className="form-label">Date *</label>
        <DatePicker
          selected={formData.date}
          onChange={handleDateChange}
          className="form-input"
          dateFormat="MMMM d, yyyy"
          maxDate={new Date()}
          required
        />
      </div>

      <button
        type="submit"
        className="btn btn-primary w-full"
        disabled={!formData.category || !formData.item || !formData.amount}
      >
        Add Expense
      </button>

      {/* Helper text */}
      {(!formData.category || !formData.item || !formData.amount) && (
        <p className="text-sm text-gray-500 text-center">
          Please fill in all required fields to add expense
        </p>
      )}
    </form>
  );
};

export default ExpenseForm;
