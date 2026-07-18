import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createItem } from "../services/pantryService";

// The default shape of a new pantry item form.
const emptyForm = {
  name: "",
  category: "",
  quantity: "",
  unit: "pcs",
  purchaseDate: "",
  expiryDate: "",
  estimatedPrice: "",
};

// Checks the form values against the same rules our backend
// enforces, so users get instant feedback instead of waiting
// for an API error.
function validate(form) {
  const errors = {};

  if (!form.name.trim()) {
    errors.name = "Name is required";
  }

  if (form.quantity === "" || Number(form.quantity) <= 0) {
    errors.quantity = "Quantity must be greater than 0";
  }

  if (form.estimatedPrice === "" || Number(form.estimatedPrice) < 0) {
    errors.estimatedPrice = "Estimated price cannot be negative";
  }

  if (!form.purchaseDate) {
    errors.purchaseDate = "Purchase date is required";
  }

  if (!form.expiryDate) {
    errors.expiryDate = "Expiry date is required";
  }

  if (
    form.purchaseDate &&
    form.expiryDate &&
    new Date(form.expiryDate) <= new Date(form.purchaseDate)
  ) {
    errors.expiryDate = "Expiry date must be after purchase date";
  }

  return errors;
}

// Add Item page: a form for creating a new pantry item.
export default function AddItem() {
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  // Updates a single field in the form as the user types.
  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setServerError("");

    // Run client-side validation first. If there are any errors,
    // show them and stop — don't bother calling the API.
    const validationErrors = validate(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      await createItem({
        name: form.name.trim(),
        category: form.category.trim() || "Uncategorized",
        quantity: Number(form.quantity),
        unit: form.unit.trim() || "pcs",
        purchaseDate: form.purchaseDate,
        expiryDate: form.expiryDate,
        estimatedPrice: Number(form.estimatedPrice),
      });

      // On success, head back to the dashboard to see the new item.
      navigate("/pantry", {
          state: {
              success: "Item added successfully"
          }
      });
    } catch (err) {
      console.error("Failed to create item:", err);
      // Show whatever message the backend sent, or a generic fallback.
      const message =
        err.response?.data?.message || "Something went wrong adding this item.";
      setServerError(Array.isArray(message) ? message.join(", ") : message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#EEF3EA] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-2xl shadow-xl shadow-[#3F6C51]/10 border border-[#3F6C51]/10 px-8 py-10">
          <h1 className="font-serif text-2xl font-semibold text-[#1F2A22]">
            Add pantry item
          </h1>
          <p className="text-sm text-[#1F2A22]/60 mt-1 mb-8">
            Fill in the details below to track a new item.
          </p>

          {/* Server-side error banner, shown only if the API call fails */}
          {serverError && (
            <div className="mb-5 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Name field */}
            <Field label="Name" error={errors.name}>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Milk"
                className={inputClasses(errors.name)}
              />
            </Field>

            {/* Category field */}
            <Field label="Category" error={errors.category}>
              <input
                type="text"
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="e.g. Dairy"
                className={inputClasses(errors.category)}
              />
            </Field>

            {/* Quantity + unit, side by side on wider screens */}
            <div className="grid grid-cols-2 gap-4">
              <Field label="Quantity" error={errors.quantity}>
                <input
                  type="number"
                  name="quantity"
                  min="0"
                  step="any"
                  value={form.quantity}
                  onChange={handleChange}
                  placeholder="1"
                  className={inputClasses(errors.quantity)}
                />
              </Field>

              <Field label="Unit" error={errors.unit}>
                <input
                  type="text"
                  name="unit"
                  value={form.unit}
                  onChange={handleChange}
                  placeholder="pcs, kg, liters…"
                  className={inputClasses(errors.unit)}
                />
              </Field>
            </div>

            {/* Purchase date + expiry date, side by side */}
            <div className="grid grid-cols-2 gap-4">
              <Field label="Purchase date" error={errors.purchaseDate}>
                <input
                  type="date"
                  name="purchaseDate"
                  value={form.purchaseDate}
                  onChange={handleChange}
                  className={inputClasses(errors.purchaseDate)}
                />
              </Field>

              <Field label="Expiry date" error={errors.expiryDate}>
                <input
                  type="date"
                  name="expiryDate"
                  value={form.expiryDate}
                  onChange={handleChange}
                  className={inputClasses(errors.expiryDate)}
                />
              </Field>
            </div>

            {/* Estimated price */}
            <Field label="Estimated price (Rs)" error={errors.estimatedPrice}>
              <input
                type="number"
                name="estimatedPrice"
                min="0"
                step="0.01"
                value={form.estimatedPrice}
                onChange={handleChange}
                placeholder="0.00"
                className={inputClasses(errors.estimatedPrice)}
              />
            </Field>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-[#3F6C51] py-2.5 font-medium text-white shadow-sm hover:bg-[#345A43] active:bg-[#2C4B39] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Adding…" : "Add item"}
            </button>
          </form>

          <p className="text-center text-sm text-[#1F2A22]/60 mt-6">
            <Link
              to="/dashboard"
              className="font-medium text-[#3F6C51] hover:text-[#E3A542] transition-colors"
            >
              ← Back to dashboard
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

// Field is a tiny helper component that wraps a label, the input
// itself, and an optional error message underneath — this keeps
// the form markup above much shorter and easier to read.
function Field({ label, error, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#1F2A22] mb-1">
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

// Returns the right input classes, adding a red border when that
// field currently has a validation error.
function inputClasses(hasError) {
  return `w-full rounded-lg border bg-[#FAFBF8] px-4 py-2.5 text-[#1F2A22] placeholder-[#1F2A22]/35 outline-none focus:ring-2 transition ${
    hasError
      ? "border-red-300 focus:border-red-400 focus:ring-red-200"
      : "border-[#1F2A22]/15 focus:border-[#3F6C51] focus:ring-[#3F6C51]/30"
  }`;
}