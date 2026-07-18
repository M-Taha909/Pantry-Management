import { getItems, deleteItem } from "../services/pantryService";
import SearchBar from "../components/SearchBar";
import CategoryFilter from "../components/CategoryFilter";
import SortDropdown from "../components/SortDropdown";
import PantryCard from "../components/PantryCard";
import { getExpiryStatus } from "../utils/expiryUtils";
import { Link, useNavigate, useLocation } from "react-router-dom";
import React, { useEffect, useState, useRef } from "react";
import Navbar from "../components/Navbar";
import { consumeItem } from "../services/consumptionService";
import toast from "react-hot-toast";

export default function Pantry() {

  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("expiry");
  const [statusFilter, setStatusFilter] = useState("all");
  const location = useLocation();
  const hasShownToast = useRef(false);

  useEffect(() => { loadItems(); }, []);
    useEffect(() => {
        if (
            location.state?.success &&
            !hasShownToast.current
        ) {
            hasShownToast.current = true;

            toast.success(location.state.success);

            navigate(location.pathname, {
                replace: true,
                state: {}
            });
        }
    }, [location, navigate]);
  const categories = [
    "All",
    ...new Set(
        items.map(item => item.category)
            .filter(Boolean)
    )
    ];
    const filteredItems = items
    .filter(item =>
        item.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
    .filter(item =>
        selectedCategory === "All"
        ? true
        : item.category === selectedCategory
    )
    .filter(item => {

        let status;

        if (item.remainingQuantity <= 0) {
            status = "consumed";
        }
        else {
            status = getExpiryStatus(item.expiryDate);
        }

        if (statusFilter === "all")
            return true;

        return status === statusFilter;
    })
    .sort((a, b) => {
        switch (sortBy) {
        case "priceLow":
            return a.estimatedPrice - b.estimatedPrice;

        case "priceHigh":
            return b.estimatedPrice - a.estimatedPrice;

        case "az":
            return a.name.localeCompare(b.name);

        case "za":
            return b.name.localeCompare(a.name);

        case "expiry":
        default:
            return (
            new Date(a.expiryDate) -
            new Date(b.expiryDate)
            );
        }
    });

  async function loadItems() {
    setIsLoading(true);
    setError("");
    try {
      const data = await getItems();
      // Our API returns { data: [...] }, so we grab that array.
      setItems(data.data ?? []);
    } catch (err) {
      console.error("Failed to load pantry items:", err);
      setError("We couldn't load your pantry items. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

async function handleConsume(item) {
    const amount =
        prompt(
            `How many ${item.name} did you consume?`
        );

    if (!amount) return;

    try {
        await consumeItem(
            item._id,
            Number(amount)
        );

        loadItems();

    } catch (err) {
        alert(err.response.data.message);
    }
}

    function handleEdit(item) {
    navigate(`/pantry/edit/${item._id}`);
    }

    // Deletes an item after a quick confirmation, then refreshes the list.
    async function handleDelete(item) {
    const confirmed = window.confirm(`Delete "${item.name}" from your pantry?`);
    if (!confirmed) return;

    try {
        await deleteItem(item._id);
        // Remove it from local state right away so the UI feels instant.
        setItems((prev) => prev.filter((i) => i._id !== item._id));
        const financialData = await getFinancialSummary();
        const categoryData = await getCategoryStats();
        const notificationData = await getNotifications();

        setFinancial(financialData);
        setCategoryStats(categoryData);
        setNotifications(notificationData);
    } catch (err) {
        console.error("Failed to delete item:", err);
        alert("Something went wrong deleting that item. Please try again.");
    }
    }

  return (
        <>
        <Navbar />

        <div className="min-h-screen bg-[#EEF3EA] p-8">
            

            <div className="max-w-7xl mx-auto">

                <div className="mb-8 flex justify-between items-center">

                    <div>
                        <h1 className="text-3xl font-bold text-[#1F2A22]">
                        Pantry Items
                        </h1>

                        <p className="text-[#1F2A22]/60 mt-1">
                        Manage and track your food inventory.
                        </p>
                    </div>

                </div>

            <div className="flex flex-wrap gap-3 mb-6">

                <SearchBar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                />

                <CategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                />

                <SortDropdown
                sortBy={sortBy}
                setSortBy={setSortBy}
                />

                <Link
                to="/pantry/add"
                className="bg-[#3F6C51] text-white px-4 py-2 rounded-lg"
                >
                + Add Item
                </Link>

            </div>

            <div className="flex flex-wrap gap-3 mb-6">

                <button
                onClick={() => setStatusFilter("all")}
                className={`px-4 py-2 rounded-xl border transition ${
                    statusFilter === "all"
                    ? "bg-[#3F6C51] text-white"
                    : "bg-white text-[#3F6C51] border-[#3F6C51]/20"
                }`}
                >
                All
                </button>

                <button
                onClick={() => setStatusFilter("safe")}
                className={`px-4 py-2 rounded-xl border transition ${
                    statusFilter === "safe"
                    ? "bg-green-600 text-white"
                    : "bg-green-50 text-green-700 border-green-200"
                }`}
                >
                Safe
                </button>

                <button
                onClick={() => setStatusFilter("expiringSoon")}
                className={`px-4 py-2 rounded-xl border transition ${
                    statusFilter === "expiringSoon"
                    ? "bg-orange-500 text-white"
                    : "bg-orange-50 text-orange-700 border-orange-200"
                }`}
                >
                Expiring Soon
                </button>

                <button
                onClick={() => setStatusFilter("expired")}
                className={`px-4 py-2 rounded-xl border transition ${
                    statusFilter === "expired"
                    ? "bg-red-500 text-white"
                    : "bg-red-50 text-red-700 border-red-200"
                }`}
                >
                Expired
                </button>

                <button
                onClick={() => setStatusFilter("consumed")}
                className={`px-4 py-2 rounded-xl border transition ${
                    statusFilter === "consumed"
                    ? "bg-gray-700 text-white"
                    : "bg-gray-50 text-gray-700 border-gray-200"
                }`}
                >
                    Consumed
                </button>

            </div>

                {
                items.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-md border border-[#3F6C51]/10 p-12 text-center">

                    <h2 className="text-3xl font-semibold text-[#1F2A22] mb-3">
                    Your pantry is empty
                    </h2>

                    <p className="text-[#1F2A22]/60 mb-8 max-w-xl mx-auto">
                    Add your first pantry item to start tracking expiry dates,
                    financial waste and recommendations.
                    </p>

                    <Link
                    to="/pantry/add"
                    className="inline-flex items-center justify-center bg-[#3F6C51] text-white px-6 py-3 rounded-xl hover:bg-[#345A43] transition"
                    >
                    Add Your First Item
                    </Link>

                </div>
                ) : filteredItems.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-md border border-[#3F6C51]/10 p-12 text-center">

                    <h2 className="text-3xl font-semibold text-[#1F2A22] mb-3">
                    No matching items found
                    </h2>

                    <p className="text-[#1F2A22]/60">
                    Try adjusting your filters or search criteria.
                    </p>

                </div>
                ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    {filteredItems.map(item => (
                    <PantryCard
                        key={item._id}
                        item={item}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onConsume={handleConsume}
                    />
                    ))}

                </div>
                )
                }

            </div>

        </div>
        </>
  );
}
