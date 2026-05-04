import { useState } from "react";

const emptyLineItem = {
  category: "",
  item: "",
  size: "",
  type: "",
  qty: ""
};

export default function App() {
  const [form, setForm] = useState({
    date: "",
    shift: "",
    store: "",
    employee: ""
  });

  const [lineItems, setLineItems] = useState([{ ...emptyLineItem }]);
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateLineItem = (index, field, value) => {
    const updated = [...lineItems];
    updated[index][field] = value;
    setLineItems(updated);
  };

  const addLineItem = () => {
    setLineItems([...lineItems, { ...emptyLineItem }]);
  };

  const removeLineItem = (index) => {
    if (lineItems.length === 1) return;
    const updated = lineItems.filter((_, i) => i !== index);
    setLineItems(updated);
  };

  const addEntry = async () => {
    if (isSubmitting) return;

    if (!form.shift || !form.store) {
      setStatus("Please fill shift and store");
      return;
    }

    const validLineItems = lineItems.filter(
      (line) => line.category && line.item && line.type && line.qty
    );

    if (validLineItems.length === 0) {
      setStatus("Please add at least one complete item");
      return;
    }

    try {
      setIsSubmitting(true);
      setStatus("Saving...");

      const dateTime = new Date().toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
      });

      for (const line of validLineItems) {
        const newEntry = {
          date: dateTime, // 🔥 includes time + seconds
          shift: form.shift,
          store: form.store,
          category: line.category,
          item: line.item,
          size: line.size,
          employee: form.employee,
          type: line.type,
          qty: Number(line.qty)
        };

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
      }

      setStatus(
        `Submitted ${validLineItems.length} item${validLineItems.length === 1 ? "" : "s"} ✅`
      );

      setForm({
        date: "",
        shift: "",
        store: "",
        employee: ""
      });

      setLineItems([{ ...emptyLineItem }]);
    } catch (err) {
      console.error(err);
      setStatus("Error submitting ❌");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial", maxWidth: 900 }}>
      <h2>Log Waste</h2>

      <h3>Shared Details</h3>

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

      <label>Employee</label>
      <br />
      <input
        placeholder="Employee"
        value={form.employee}
        onChange={(e) => setForm({ ...form, employee: e.target.value })}
      />
      <br /><br />

      <h3>Waste Items</h3>

      {lineItems.map((line, index) => (
        <div
          key={index}
          style={{
            border: "1px solid #ccc",
            padding: 15,
            marginBottom: 15,
            borderRadius: 8
          }}
        >
          <strong>Item {index + 1}</strong>
          <br /><br />

          <label>Category</label>
          <br />
          <select
            value={line.category}
            onChange={(e) => updateLineItem(index, "category", e.target.value)}
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
            value={line.item}
            onChange={(e) => updateLineItem(index, "item", e.target.value)}
          />
          <br /><br />

          <label>Size</label>
          <br />
          <input
            placeholder="Optional"
            value={line.size}
            onChange={(e) => updateLineItem(index, "size", e.target.value)}
          />
          <br /><br />

          <label>Type</label>
          <br />
          <select
            value={line.type}
            onChange={(e) => updateLineItem(index, "type", e.target.value)}
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
            value={line.qty}
            onChange={(e) => updateLineItem(index, "qty", e.target.value)}
          />
          <br /><br />

          {lineItems.length > 1 && (
            <button onClick={() => removeLineItem(index)} disabled={isSubmitting}>
              Remove This Item
            </button>
          )}
        </div>
      ))}

      <button onClick={addLineItem} disabled={isSubmitting} style={{ marginRight: 10 }}>
        + Add Another Item
      </button>

      <button onClick={addEntry} disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Submit All Items"}
      </button>

      <p style={{ marginTop: 20 }}>{status}</p>
    </div>
  );
}