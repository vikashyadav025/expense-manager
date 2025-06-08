import ExpenseSummary from "../components/ExpenseSummary.jsx";

const ReportsPage = () => {
  return (
    <div
      className="container"
      style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}
    >
      <div className="card">
        <ExpenseSummary />
      </div>
    </div>
  );
};

export default ReportsPage;
