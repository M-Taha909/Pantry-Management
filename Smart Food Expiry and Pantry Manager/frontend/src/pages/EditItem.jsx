import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { getItem, updateItem } from "../services/pantryService";

// The default shape of the edit form, before real data loads in.
const emptyForm = {
  name: "",
  category: "",
  quantity: "",
  unit: "",
  purchaseDate: "",
  expiryDate: "",
  estimatedPrice: "",
};

// <input type="date"> needs a value formatted like "2026-07-10".
// Our API returns full ISO timestamps, so we convert here.
function toDateInputValue(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

// Same validation rules as the Add Item page, so users get instant
// feedback here too instead of waiting on an API error.
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

// Edit Item page: loads an existing pantry item by id, prefills
// the form, and sends updates back to the backend on submit.
export default function EditItem() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [serverError, setServerError] = useState("");

  // Fetch the existing item once, when the page first loads,
  // and use it to fill in the form fields.
  useEffect(() => {
    async function loadItem() {
      setIsLoading(true);
      setLoadError("");
      try {
        const result = await getItem(id);
        const item = result.data;
        setForm({
          name: item.name ?? "",
          category: item.category ?? "",
          quantity: item.quantity ?? "",
          unit: item.unit ?? "",
          purchaseDate: toDateInputValue(item.purchaseDate),
          expiryDate: toDateInputValue(item.expiryDate),
          estimatedPrice: item.estimatedPrice ?? "",
        });
      } catch (err) {
        console.error("Failed to load item:", err);
        setLoadError("We couldn't load this item. It may not exist anymore.");
      } finally {
        setIsLoading(false);
      }
    }

    loadItem();
  }, [id]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setServerError("");

    const validationErrors = validate(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      await updateItem(id, {
        name: form.name.trim(),
        category: form.category.trim() || "Uncategorized",
        quantity: Number(form.quantity),
        unit: form.unit.trim() || "pcs",
        purchaseDate: form.purchaseDate,
        expiryDate: form.expiryDate,
        estimatedPrice: Number(form.estimatedPrice),
      });

      navigate("/pantry", {
        state: {
          success: "Item updated successfully"
        }
      });
    } catch (err) {
      console.error("Failed to update item:", err);
      const message =
        err.response?.data?.message || "Something went wrong updating this item.";
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
            Edit pantry item
          </h1>
          <p className="text-sm text-[#1F2A22]/60 mt-1 mb-8">
            Update the details below and save your changes.
          </p>

          {/* Loading state while we fetch the existing item */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12 text-[#1F2A22]/60">
              <div className="h-8 w-8 rounded-full border-2 border-[#3F6C51]/30 border-t-[#3F6C51] animate-spin mb-3" />
              <p className="text-sm">Loading item…</p>
            </div>
          )}

          {/* Error state if the item couldn't be fetched */}
          {!isLoading && loadError && (
            <div className="text-center py-6">
              <p className="text-sm text-red-600 mb-4">{loadError}</p>
              <Link
                to="/dashboard"
                className="text-sm font-medium text-[#3F6C51] hover:text-[#E3A542] transition-colors"
              >
                ← Back to dashboard
              </Link>
            </div>
          )}

          {/* The actual edit form, once data has loaded successfully */}
          {!isLoading && !loadError && (
            <>
              {serverError && (
                <div className="mb-5 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                  {serverError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <Field label="Name" error={errors.name}>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className={inputClasses(errors.name)}
                  />
                </Field>

                <Field label="Category" error={errors.category}>
                  <input
                    type="text"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className={inputClasses(errors.category)}
                  />
                </Field>

                <div className="grid grid-cols-2 gap-4">
                  <Field label="Quantity" error={errors.quantity}>
                    <input
                      type="number"
                      name="quantity"
                      min="0"
                      step="any"
                      value={form.quantity}
                      onChange={handleChange}
                      className={inputClasses(errors.quantity)}
                    />
                  </Field>

                  <Field label="Unit" error={errors.unit}>
                    <input
                      type="text"
                      name="unit"
                      value={form.unit}
                      onChange={handleChange}
                      className={inputClasses(errors.unit)}
                    />
                  </Field>
                </div>

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

                <Field label="Estimated price (Rs)" error={errors.estimatedPrice}>
                  <input
                    type="number"
                    name="estimatedPrice"
                    min="0"
                    step="0.01"
                    value={form.estimatedPrice}
                    onChange={handleChange}
                    className={inputClasses(errors.estimatedPrice)}
                  />
                </Field>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-lg bg-[#3F6C51] py-2.5 font-medium text-white shadow-sm hover:bg-[#345A43] active:bg-[#2C4B39] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Saving…" : "Save changes"}
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Same small Field helper used on the Add Item page, duplicated
// here so this file works standalone.
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

function inputClasses(hasError) {
  return `w-full rounded-lg border bg-[#FAFBF8] px-4 py-2.5 text-[#1F2A22] placeholder-[#1F2A22]/35 outline-none focus:ring-2 transition ${
    hasError
      ? "border-red-300 focus:border-red-400 focus:ring-red-200"
      : "border-[#1F2A22]/15 focus:border-[#3F6C51] focus:ring-[#3F6C51]/30"
  }`;
}