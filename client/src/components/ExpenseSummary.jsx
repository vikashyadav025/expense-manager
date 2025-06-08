import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
} from "date-fns";
import { getExpenseSummary, getExpenses } from "../services/expenseService";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

const ExpenseSummary = () => {
  const [categorySummary, setCategorySummary] = useState([]);
  const [itemSummary, setItemSummary] = useState([]);
  const [dateSummary, setDateSummary] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("category");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryData, expensesData] = await Promise.all([
          getExpenseSummary(),
          getExpenses(),
        ]);

        setCategorySummary(summaryData);
        setExpenses(expensesData);

        // Generate item summary
        const itemSummaryData = generateItemSummary(expensesData);
        setItemSummary(itemSummaryData);

        // Generate date summary (last 7 days)
        const dateSummaryData = generateDateSummary(expensesData);
        setDateSummary(dateSummaryData);

        setLoading(false);
      } catch (error) {
        toast.error(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const generateItemSummary = (expenses) => {
    const itemMap = {};
    expenses.forEach((expense) => {
      const itemName = expense.item?.name || "Unknown";
      if (itemMap[itemName]) {
        itemMap[itemName] += expense.amount;
      } else {
        itemMap[itemName] = expense.amount;
      }
    });

    return Object.entries(itemMap)
      .map(([item, totalAmount]) => ({
        item,
        totalAmount,
      }))
      .sort((a, b) => b.totalAmount - a.totalAmount);
  };

  const generateDateSummary = (expenses) => {
    const dateMap = {};
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return format(date, "yyyy-MM-dd");
    }).reverse();

    // Initialize all dates with 0
    last7Days.forEach((date) => {
      dateMap[date] = 0;
    });

    // Sum expenses by date
    expenses.forEach((expense) => {
      const expenseDate = format(new Date(expense.date), "yyyy-MM-dd");
      if (dateMap.hasOwnProperty(expenseDate)) {
        dateMap[expenseDate] += expense.amount;
      }
    });

    return Object.entries(dateMap).map(([date, totalAmount]) => ({
      date: format(new Date(date), "MMM dd"),
      fullDate: date,
      totalAmount,
    }));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const categoryChartData = {
    labels: categorySummary.map((item) => item.category),
    datasets: [
      {
        data: categorySummary.map((item) => item.totalAmount),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
          "#FF6384",
          "#C9CBCF",
        ],
      },
    ],
  };

  const itemChartData = {
    labels: itemSummary.slice(0, 8).map((item) => item.item),
    datasets: [
      {
        data: itemSummary.slice(0, 8).map((item) => item.totalAmount),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
          "#FF6384",
          "#C9CBCF",
        ],
      },
    ],
  };

  const dateChartData = {
    labels: dateSummary.map((item) => item.date),
    datasets: [
      {
        label: "Daily Expenses",
        data: dateSummary.map((item) => item.totalAmount),
        backgroundColor: "#36A2EB",
        borderColor: "#36A2EB",
        borderWidth: 1,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return "Rs." + value.toFixed(2);
          },
        },
      },
    },
  };

  const totalCategoryAmount = categorySummary.reduce(
    (sum, item) => sum + item.totalAmount,
    0
  );
  const totalItemAmount = itemSummary.reduce(
    (sum, item) => sum + item.totalAmount,
    0
  );
  const totalDateAmount = dateSummary.reduce(
    (sum, item) => sum + item.totalAmount,
    0
  );

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab("category")}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === "category"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          By Category
        </button>
        <button
          onClick={() => setActiveTab("item")}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === "item"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          By Item
        </button>
        <button
          onClick={() => setActiveTab("date")}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === "date"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          By Date (Last 7 Days)
        </button>
      </div>

      {/* Category Report */}
      {activeTab === "category" && (
        <div>
          <h2 className="text-lg font-medium mb-4">
            Expense Summary by Category
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-64">
              <Pie data={categoryChartData} />
            </div>
            <div>
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <h3 className="text-lg font-semibold text-blue-800">
                  Total: Rs. {totalCategoryAmount.toFixed(2)}/-
                </h3>
                <p className="text-sm text-blue-600">
                  Across {categorySummary.length} categories
                </p>
              </div>
              <div className="max-h-48 overflow-y-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Category
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {categorySummary.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {item.category}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          Rs. {item.totalAmount.toFixed(2)}/-
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Item Report */}
      {activeTab === "item" && (
        <div>
          <h2 className="text-lg font-medium mb-4">Expense Summary by Item</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-64">
              <Pie data={itemChartData} />
            </div>
            <div>
              <div className="bg-green-50 p-4 rounded-lg mb-4">
                <h3 className="text-lg font-semibold text-green-800">
                  Total: Rs. {totalItemAmount.toFixed(2)}/-
                </h3>
                <p className="text-sm text-green-600">
                  Across {itemSummary.length} items
                </p>
              </div>
              <div className="max-h-48 overflow-y-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Item
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {itemSummary.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {item.item}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          Rs. {item.totalAmount.toFixed(2)}/-
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Date Report */}
      {activeTab === "date" && (
        <div>
          <h2 className="text-lg font-medium mb-4">
            Daily Expense Summary (Last 7 Days)
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-64">
              <Bar data={dateChartData} options={barChartOptions} />
            </div>
            <div>
              <div className="bg-purple-50 p-4 rounded-lg mb-4">
                <h3 className="text-lg font-semibold text-purple-800">
                  7-Day Total: Rs. {totalDateAmount.toFixed(2)}/-
                </h3>
                <p className="text-sm text-purple-600">
                  Average: Rs. {(totalDateAmount / 7).toFixed(2)} per day
                </p>
              </div>
              <div className="max-h-48 overflow-y-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Date
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {dateSummary.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {item.date}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          Rs. {item.totalAmount.toFixed(2)}/-
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseSummary;
