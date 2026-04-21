import { useState } from "react";

export default function App() {
  const [form, setForm] = useState({
    date: "",
    shift: "",
    store: "",
    category: "",
    item: "",
    size: "",
    employee: "",
    type: "",
    qty: ""
  });

  const [status, setStatus] = useState("");

  const addEntry = async () => {
    if (
      !form.date ||
      !form.shift ||
      !form.store ||
      !form.category ||
      !form.item ||
      !form.type ||
      !form.qty
    ) {
      setStatus("Please fill all required fields");
      return;
    }

    const newEntry = {
      date: form.date,
      shift: form.shift,
      store: form.store,
      category: form.category,
      item: form.item,
      size: form.size,
      employee: form.employee,
      type: form.type,
      qty: Number(form.qty)
    };

    try {
      await fetch(
        "https://script.google.com/macros/s/AKfycbzvBoQX57NRG9VbnitBhAxd9daFKl36hqffl9OJyQGppMvAPd_PIVx1PgM7fr6B_PGh/exec",
        {
          method: "POST",
          mode: "no-cors",
          body: JSON.stringify(newEntry),
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      setStatus("Entry submitted ✅");

      setForm({
        date: "",
        shift: "",
        store: "",
        category: "",
        item: "",
        size: "",
        employee: "",
        type: "",
        qty: ""
      });
    } catch (err) {
      console.error(err);
      setStatus("Error submitting ❌");
    }
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial", maxWidth: 520 }}>
      <h2>Log Waste</h2>

      <label>Date</label>
      <br />
      <input
        type="date"
        value={form.date}
        onChange={(e) => setForm({ ...form, date: e.target.value })}
      />
      <br /><br />

      <label>Shift</label>
      <br />
      <select
        value={form.shift}
        onChange={(e) => setForm({ ...form, shift: e.target.value })}
      >
        <option value="">Select Shift</option>
        <option value="morning">Morning</option>
        <option value="midday">Midday</option>
        <option value="evening">Evening</option>
      </select>
      <br /><br />

      <label>Store</label>
      <br />
      <select
        value={form.store}
        onChange={(e) => setForm({ ...form, store: e.target.value })}
      >
        <option value="">Select Store</option>
        <option value="Buckland Hills">Buckland Hills</option>
        <option value="WeHa">WeHa</option>
        <option value="Milford">Milford</option>
        <option value="West Springfield">West Springfield</option>
        <option value="Waterbury">Waterbury</option>
      </select>
      <br /><br />

      <label>Category</label>
      <br />
      <select
        value={form.category}
        onChange={(e) => setForm({ ...form, category: e.target.value })}
      >
        <option value="">Select Category</option>
        <option value="cookie">Cookie</option>
        <option value="ingredient">Ingredient</option>
        <option value="equipment">Equipment</option>
        <option value="other">Other</option>
      </select>
      <br /><br />

      <label>Item</label>
      <br />
      <input
        placeholder="Cookie name, milk, tool, etc."
        value={form.item}
        onChange={(e) => setForm({ ...form, item: e.target.value })}
      />
      <br /><br />

      <label>Size</label>
      <br />
      <input
        placeholder="Optional"
        value={form.size}
        onChange={(e) => setForm({ ...form, size: e.target.value })}
      />
      <br /><br />

      <label>Employee</label>
      <br />
      <input
        placeholder="Employee"
        value={form.employee}
        onChange={(e) => setForm({ ...form, employee: e.target.value })}
      />
      <br /><br />

      <label>Type</label>
      <br />
      <select
        value={form.type}
        onChange={(e) => setForm({ ...form, type: e.target.value })}
      >
        <option value="">Select Type</option>
        <option value="overproduction">Overproduction</option>
        <option value="quality">Quality Issue</option>
        <option value="damage">Damage / Breakage</option>
        <option value="expired">Expired / Spoiled</option>
        <option value="training">Training / Test</option>
      </select>
      <br /><br />

      <label>Quantity</label>
      <br />
      <input
        type="number"
        placeholder="Quantity"
        value={form.qty}
        onChange={(e) => setForm({ ...form, qty: e.target.value })}
      />
      <br /><br />

      <button onClick={addEntry}>Add Entry</button>

      <p style={{ marginTop: 20 }}>{status}</p>
    </div>
  );
}