import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ItemForm from "../components/ItemForm.jsx";
import { getItems, deleteItem } from "../services/itemService";
import { getCategories } from "../services/categoryService";

const ItemsPage = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [itemsData, categoriesData] = await Promise.all([
        getItems(),
        getCategories(),
      ]);

      setItems(Array.isArray(itemsData) ? itemsData : itemsData?.data || []);
      setCategories(
        Array.isArray(categoriesData)
          ? categoriesData
          : categoriesData?.data || []
      );
    } catch (error) {
      toast.error(error.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleItemAdded = (newItem) => {
    setItems([...items, newItem]);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await deleteItem(id);
        setItems(items.filter((item) => item._id !== id));
        toast.success("Item deleted successfully");
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  // Filter items based on selected category
  const filteredItems = filterCategory
    ? items.filter(
        (item) =>
          item.category?._id === filterCategory ||
          item.category === filterCategory
      )
    : items;

  // Group items by category for better display
  const itemsByCategory = categories.reduce((acc, category) => {
    const categoryItems = items.filter(
      (item) =>
        item.category?._id === category._id || item.category === category._id
    );
    if (categoryItems.length > 0) {
      acc[category.name] = categoryItems;
    }
    return acc;
  }, {});

  return (
    <div
      className="container"
      style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Add Item Form */}
        <div className="card">
          <h2 className="text-lg font-medium mb-4">Add New Item</h2>
          <ItemForm onItemAdded={handleItemAdded} />
        </div>

        {/* Items List */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Items List</h2>
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600">Filter by:</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="form-select text-sm"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div>Loading...</div>
          ) : (
            <div className="space-y-4">
              {filteredItems.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  {filterCategory
                    ? "No items found in selected category."
                    : "No items found. Add your first item!"}
                </p>
              ) : (
                <>
                  {/* Show filtered items if filter is applied */}
                  {filterCategory ? (
                    <div className="space-y-3">
                      {filteredItems.map((item) => (
                        <div
                          key={item._id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {item.name}
                            </h3>
                            <p className="text-sm text-gray-500">
                              Category: {item.category?.name || "Unknown"}
                            </p>
                            <p className="text-xs text-gray-400">
                              Created:{" "}
                              {new Date(item.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="btn btn-danger"
                          >
                            Delete
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    /* Show items grouped by category if no filter */
                    <div className="space-y-4">
                      {Object.entries(itemsByCategory).map(
                        ([categoryName, categoryItems]) => (
                          <div
                            key={categoryName}
                            className="border rounded-lg p-3"
                          >
                            <h3 className="font-semibold text-gray-800 mb-2 pb-2 border-b">
                              {categoryName} ({categoryItems.length} items)
                            </h3>
                            <div className="space-y-2">
                              {categoryItems.map((item) => (
                                <div
                                  key={item._id}
                                  className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                                >
                                  <div>
                                    <h4 className="font-medium text-gray-900">
                                      {item.name}
                                    </h4>
                                    <p className="text-xs text-gray-400">
                                      Created:{" "}
                                      {new Date(
                                        item.createdAt
                                      ).toLocaleDateString()}
                                    </p>
                                  </div>
                                  <button
                                    onClick={() => handleDelete(item._id)}
                                    className="btn btn-danger btn-sm"
                                  >
                                    Delete
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  )}
                </>
              )}

              {/* Summary */}
              {items.length > 0 && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex justify-between text-sm text-blue-800">
                    <span>Total Items: {items.length}</span>
                    <span>
                      Categories: {Object.keys(itemsByCategory).length}
                    </span>
                  </div>
                  {filterCategory && (
                    <p className="text-xs text-blue-600 mt-1">
                      Showing {filteredItems.length} items in selected category
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemsPage;
