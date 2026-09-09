import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [expenses, setExpense] = useState([]);

  const [formData, setFormdata] = useState({
    amount: "",
    category: "",
    description: "",
    expense_date: "",
  });

  const [editingId, setEditingId] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormdata({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/expenses"
        );

        const data = await response.json();

        console.log(data);

        setExpense(data);
      } catch (error) {
        console.log("Failed to fetch Expense:", error);
      }
    };

    fetchExpense();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Sending:", formData);

    if (editingId === null) {
      try {
        const response = await fetch(
          "http://localhost:5000/api/expenses",
          {
            method: "POST",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify(formData),
          }
        );

        const data = await response.json();

        console.log(data);

        setExpense((prev) => [...prev, data[0]]);

        setFormdata({
          amount: "",
          category: "",
          description: "",
          expense_date: "",
        });
      } catch (error) {
        console.log("Failed to Add Expense:", error);
      }
    } else {
      try {
        const response = await fetch(
          `http://localhost:5000/api/expenses/${editingId}`,
          {
            method: "PUT",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify(formData),
          }
        );

        const data = await response.json();

        console.log(data);

        setExpense((prev) =>
          prev.map((expense) =>
            expense.id === editingId
              ? { ...expense, ...formData }
              : expense
          )
        );

        setEditingId(null);

        setFormdata({
          amount: "",
          category: "",
          description: "",
          expense_date: "",
        });
      } catch (error) {
        console.log("Failed to edit the expense:", error);
      }
    }
  };

  const handleEdit = (expense) => {
    setEditingId(expense.id);

    setFormdata({
      amount: expense.amount,
      category: expense.category,
      description: expense.description,
      expense_date: expense.expense_date.split("T")[0],
    });
  };

  const handleDelete = async (expense) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/expenses/${expense.id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.log(data);
        return;
      }

      const expenseResponse = await fetch(
        "http://localhost:5000/api/expenses"
      );

      const expenseData = await expenseResponse.json();

      setExpense(expenseData);
    } catch (error) {
      console.log("Delete Failed:", error);
    }
  };

  return (
    <>
      <div className="expense">
        <form className="expense-form" onSubmit={handleSubmit}>
          <input
            name="amount"
            value={formData.amount}
            type="number"
            placeholder="Amount"
            onChange={handleChange}
          />

          <select
            name="category"
            className="category-select"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="">Select Category</option>
            <option value="Food">Food</option>
            <option value="Fashion">Dresses</option>
          </select>

          <input
            name="description"
            value={formData.description}
            type="text"
            placeholder="Description"
            onChange={handleChange}
          />

          <input
            name="expense_date"
            value={formData.expense_date}
            type="date"
            onChange={handleChange}
          />

          <button type="submit">
            {editingId !== null
              ? "Update Expense"
              : "Add Expense"}
          </button>
        </form>
      </div>

      <div className="table-card">
        <table className="table">
          <thead>
            <tr>
              <th>Expense ID</th>
              <th>Amount</th>
              <th>Category</th>
              <th>Description</th>
              <th>Expense Date</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {expenses.map((expense) => (
              <tr key={expense.id}>
                <td>{expense.id}</td>
                <td>{expense.amount}</td>
                <td>{expense.category}</td>
                <td>{expense.description}</td>
                <td>{expense.expense_date.split("T")[0]}</td>

                <td>
                  <button
                    onClick={() => handleEdit(expense)}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(expense)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default App;