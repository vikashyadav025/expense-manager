import { useState } from "react";
import { toast } from "react-toastify";
import { createCategory } from "../services/categoryService";

const CategoryForm = ({ onCategoryAdded }) => {
  const [name, setName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const category = await createCategory({ name });
      toast.success("Category added successfully");
      setName("");
      if (onCategoryAdded) {
        onCategoryAdded(category);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="form-label">Category Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="form-input"
          required
        />
      </div>

      <button type="submit" className="btn btn-success">
        Add Category
      </button>
    </form>
  );
};

export default CategoryForm;
