import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import CategoryForm from "../components/CategoryForm.jsx";
import { getCategories, deleteCategory } from "../services/categoryService";

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      // Ensure data is always an array
      setCategories(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (error) {
      toast.error(error.message);
      setCategories([]); // Ensure it's always an array even on error
      setLoading(false);
    }
  };

  const handleCategoryAdded = (newCategory) => {
    setCategories([...categories, newCategory]);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteCategory(id);
        setCategories(categories.filter((category) => category._id !== id));
        toast.success("Category deleted successfully");
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <div
      className="container"
      style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Add Category Form */}
        <div className="card">
          <h2 className="text-lg font-medium mb-4">Add New Category</h2>
          <CategoryForm onCategoryAdded={handleCategoryAdded} />
        </div>

        {/* Categories List */}
        <div className="card">
          <h2 className="text-lg font-medium mb-4">Categories List</h2>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <div className="space-y-3">
              {categories.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  No categories found. Add your first category!
                </p>
              ) : (
                categories.map((category) => (
                  <div
                    key={category._id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Created:{" "}
                        {new Date(category.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(category._id)}
                      className="btn btn-danger"
                    >
                      Delete
                    </button>
                  </div>
                ))
              )}
              {categories.length > 0 && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    Total Categories: {categories.length}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;
