import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { createItem } from "../services/itemService";
import { getCategories } from "../services/categoryService";

const ItemForm = ({ onItemAdded }) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(Array.isArray(data) ? data : data?.data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to load categories");
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const item = await createItem({ name, category });
      toast.success("Item added successfully");
      setName("");
      setCategory("");
      if (onItemAdded) {
        onItemAdded(item);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading) {
    return <div className="text-center p-4">Loading categories...</div>;
  }

  if (!categories.length) {
    return (
      <div className="alert alert-warning">
        No categories found. Please create categories first before adding items.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="form-label">Category *</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="form-select"
          required
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="form-label">Item Name *</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="form-input"
          placeholder="Enter item name"
          required
        />
      </div>

      <button
        type="submit"
        className="btn btn-warning"
        disabled={!name || !category}
      >
        Add Item
      </button>
    </form>
  );
};

export default ItemForm;
