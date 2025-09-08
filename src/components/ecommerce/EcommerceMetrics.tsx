import { useEffect, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import {
  BoxIconLine,
  GroupIcon,
  EarningIcon,
} from "../../icons";
import { Dashboard } from "../../Types/Dashboard";
import { FetchData } from "../../utils/FetchData";

export default function EcommerceMetrics() {
  const [dashboardStats, setDashboardStats] = useState<Dashboard>({
    totalInfluencers: 0,
    totalBusinesses: 0,
    totalEarnings: "0",
  });

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const res = await FetchData("/dashboard/getAdminDashboardStats");
        if (res && res.status && res.data) {
          setDashboardStats(res.data as Dashboard);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      }
    };

    fetchDashboardStats();
  }, []);

  return (
    <>
      <PageMeta
        title=""
        description="Overview of Influencers, Businesses, and Earnings"
      />
      <PageBreadcrumb pageTitle="Dashboard" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-12">
        {/* Influencer */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8 dark:border-gray-800 dark:bg-white/[0.03]" style={{ height: "125px" }}>
          <div className="flex items-start justify-between h-full">
            <div className="flex flex-col items-center justify-center">
              <div className="w-14 h-14 flex items-center justify-center bg-gray-100 rounded-xl dark:bg-gray-800">
                <BoxIconLine className="text-gray-800 w-6 h-6 dark:text-white/90" />
              </div>
            </div>
            <div className="flex flex-col items-end justify-center text-right">
              <h4 className="text-base font-medium text-gray-600 dark:text-gray-300">
                Total Influencer
              </h4>
              <h5 className="text-1xl font-bold text-gray-800 dark:text-white/90 m-0">
                {dashboardStats.totalInfluencers.toLocaleString()}
              </h5>
            </div>
          </div>
        </div>

        {/* Business */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8 dark:border-gray-800 dark:bg-white/[0.03]" style={{ height: "125px" }}>
          <div className="flex items-start justify-between h-full">
            <div className="flex flex-col items-center justify-center">
              <div className="w-14 h-14 flex items-center justify-center bg-gray-100 rounded-xl dark:bg-gray-800">
                <GroupIcon className="text-gray-800 w-6 h-6 dark:text-white/90" />
              </div>
            </div>
            <div className="flex flex-col items-end justify-center text-right">
              <h4 className="text-base font-medium text-gray-600 dark:text-gray-300">
                Total Business
              </h4>
              <h5 className="text-1xl font-bold text-gray-800 dark:text-white/90 m-0">
                {dashboardStats.totalBusinesses.toLocaleString()}
              </h5>
            </div>
          </div>
        </div>

        {/* Earning */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8 dark:border-gray-800 dark:bg-white/[0.03]" style={{ height: "125px" }}>
          <div className="flex items-start justify-between h-full">
            <div className="flex flex-col items-center justify-center">
              <div className="w-14 h-14 flex items-center justify-center bg-gray-100 rounded-xl dark:bg-gray-800">
                <EarningIcon className="text-gray-800 w-6 h-6 dark:text-white/90" />
              </div>
            </div>
            <div className="flex flex-col items-end justify-center text-right">
              <h4 className="text-base font-medium text-gray-600 dark:text-gray-300">
                Total Earning
              </h4>
              <h5 className="text-1xl font-bold text-gray-800 dark:text-white/90 m-0">
                ₹{parseFloat(dashboardStats.totalEarnings).toLocaleString()}
              </h5>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
