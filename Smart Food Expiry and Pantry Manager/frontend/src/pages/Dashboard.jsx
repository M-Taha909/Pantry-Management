import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import NotificationCenter from "../components/NotificationCenter";
import { getNotifications, getFinancialSummary, getCategoryStats, getStats, getConsumeFirst } from "../services/dashboardService";
import AnalyticsCards from "../components/AnalyticsCards";
import CategoryPieChart from "../components/CategoryPieChart";
import WasteBarChart from "../components/WasteBarChart";
import HealthScoreCard from "../components/HealthScoreCard";
import ConsumeFirst from "../components/ConsumeFirst";
import { Link } from "react-router-dom";


// Small reused "freshness dial" icon, matching Login/Register.
function FreshnessMark() {
  return (
    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#3F6C51] shadow-md shadow-[#3F6C51]/30">
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="#EEF3EA"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 14c0-6 4-10 10-10 1 6-1 10-4 12-3 2-6 1-6-2z" />
        <path d="M6 18c2-3 5-5 8-7" />
      </svg>
    </div>
  );
}

// Dashboard page: shows a welcome header plus the user's pantry
// items, fetched from the backend. Handles loading, empty, and
// loaded states, and lets the user jump to Add/Edit item pages.
export default function Dashboard() {

  // items: the list of pantry items once loaded.
  // isLoading: true while the initial fetch is in flight.
  // error: holds a message if the fetch failed.
  const [notifications, setNotifications] = useState([]);
  const [financial, setFinancial] = useState({});
  const [categoryStats, setCategoryStats] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [consumeFirst, setConsumeFirst] = useState([]);

  // Pulls the latest pantry items from the backend and updates state.


  // Fetch items once, when the Dashboard first mounts.
  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const notificationData = await getNotifications();
        const financialData = await getFinancialSummary();
        const categoryData = await getCategoryStats();
        const statsData = await getStats();
        const consumeData = await getConsumeFirst();

        setNotifications(notificationData);
        setFinancial(financialData);
        setCategoryStats(categoryData);
        setStats(statsData);
        setConsumeFirst(consumeData);
      }
      catch (err) {
        console.log(err);
      }
      finally {
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, []);
  // Sends the user to the Edit Item page for a specific item.

  return (
    <>
      <Navbar />
      <div className="min-h-screen w-full bg-[#EEF3EA] px-4 py-8 sm:py-10">
        <div className="mx-auto w-full max-w-5xl">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <FreshnessMark />
              <div>
                <h1 className="font-serif text-xl sm:text-2xl font-semibold text-[#1F2A22]">
                  Welcome to Smart Food Expiry and Pantry Manager
                </h1>

                <p className="text-[#1F2A22]/60 mt-1">
                  Monitor food waste, savings, and pantry health.
                </p>
              </div>
            </div>
          </div>

          {/* Empty Dashboard State */}
          {stats.total === 0 ? (
            <div className="bg-white rounded-2xl shadow-md border border-[#3F6C51]/10 p-12 text-center">

              <h2 className="text-3xl font-semibold text-[#1F2A22] mb-3">
                Your pantry is empty
              </h2>

              <p className="text-[#1F2A22]/60 mb-8 max-w-xl mx-auto">
                Add your first pantry item to unlock financial analytics,
                health scoring, expiry tracking and smart recommendations.
              </p>

              <Link
                to="/pantry/add"
                className="inline-flex items-center justify-center bg-[#3F6C51] text-white px-6 py-3 rounded-xl hover:bg-[#345A43] transition"
              >
                Add Your First Item
              </Link>

            </div>
          ) : (
            <>
              <NotificationCenter
                notifications={notifications}
              />

              {/* Alert Center */}
              <div className="bg-white rounded-2xl shadow-md border border-[#3F6C51]/10 p-6 mb-6">
                <h2 className="text-2xl font-semibold text-[#3F6C51] mb-5">
                  Alert Center
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                  <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center">
                    <p className="text-3xl font-bold text-red-600">
                      {stats.expired}
                    </p>

                    <p className="text-sm text-red-700 mt-1">
                      Expired Items
                    </p>
                  </div>

                  <div className="rounded-xl border border-orange-200 bg-orange-50 p-4 text-center">
                    <p className="text-3xl font-bold text-orange-600">
                      {stats.critical}
                    </p>

                    <p className="text-sm text-orange-700 mt-1">
                      Critical Items
                    </p>
                  </div>

                  <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-center">
                    <p className="text-3xl font-bold text-yellow-700">
                      {stats.expiringSoon}
                    </p>

                    <p className="text-sm text-yellow-800 mt-1">
                      Expiring Soon
                    </p>
                  </div>

                </div>

                <div className="mt-5 text-sm text-[#1F2A22]/60 border-t pt-4">
                  Monitor these items to reduce food waste and improve pantry health.
                </div>
              </div>

              <HealthScoreCard
                stats={stats}
              />

              <AnalyticsCards
                stats={stats}
                financial={financial}
              />

              <ConsumeFirst
                items={consumeFirst}
              />

              <div className="grid lg:grid-cols-2 gap-6 mb-8">
                <CategoryPieChart
                  data={categoryStats.categoryCounts || {}}
                />

                <WasteBarChart
                  data={categoryStats.wastedCategories || {}}
                />
              </div>
            </>
          )}

        </div>
      </div>
    </>
  );
}