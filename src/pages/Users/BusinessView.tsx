import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Preloader from "../../components/common/Preloader";
import Button from "../../components/ui/button/Button";
import { FetchData } from "../../utils/FetchData";

export default function BusinessView() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const userId = searchParams.get("id");

  useEffect(() => {
    if (!userId) {
      toast.error("No business ID provided.");
      navigate("/user/business");
      return;
    }
        //   user?: any;
        // earningsSummary?: any;
        // badges?: any;
        // brandData?: any; 


    // const fetchUser = async () => {
    //   setLoading(true);
    //   try {
    //     const result = await FetchData("/user/get", "POST", { id: userId }) as {
    //       status: boolean;
    //       data: { user?: any } | any;
    //       message?: string;
    //     };

    //     const apiUser = "user" in result.data ? result.data.user : result.data;
    //           //console.log("Badges Data:", result.data.badges);

    //     if (result.status && apiUser) {
    //       setUser(apiUser);
    //     } else {
    //       toast.error(result.message || "User not found.");
    //       navigate("/user/business");
    //     }
    //   } catch (error) {
    //     console.error("Error fetching business user:", error);
    //     toast.error("Failed to fetch business user.");
    //     navigate("/user/business");
    //   } finally {
    //     setLoading(false);
    //   }
    // };


    const fetchUser = async () => {
  setLoading(true);
  try {
    const result = await FetchData("/user/get", "POST", { id: userId }) as {
      status: boolean;
      data: {
        user?: any;
        earningsSummary?: any;
        badges?: any;
        brandData?: any; 

      };
      message?: string;
    };

    if (result.status && result.data.user) {
      const mergedUser = {
        ...result.data.user,
        earningsSummary: result.data.earningsSummary || {},
        badges: result.data.badges || [], 
        brandData: result.data.brandData || null, 

      };
            console.log("Badges Data:", result.data.badges);

      //console.log("Badges Data:", result.data.badges);
      //console.log("Merged user object:", mergedUser); // ebugging line
      setUser(mergedUser);
    } else {
      toast.error(result.message || "User not found.");
      navigate("/user/influencer");
    }
  } catch (error) {
    console.error("Error fetching influencer:", error);
    toast.error("Failed to fetch influencer user.");
    navigate("/user/influencer");
  } finally {
    setLoading(false);
  }
};

    fetchUser();
  }, [userId, navigate]);

  const formatDate = (dateStr?: string) => {
    try {
      return dateStr ? new Date(dateStr).toLocaleDateString() : "N/A";
    } catch {
      return "N/A";
    }
  };

  const fallback = (value: any) => {
    if (typeof value === "string" && value.trim()) return value;
    if (typeof value === "number" || typeof value === "boolean") return value.toString();
    return "Not provided";
  };

  if (loading) return <Preloader />;
  if (!user) return null;

  return (
    <>
      <PageMeta title="Business View" description="Business user detail" />
      <PageBreadcrumb pageTitle="Business Detail" />

      <div className="space-y-6">
        {/* Business Info */}
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex items-center justify-between px-6 py-5">
            <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
              Business Detail
            </h3>
            <Button
              size="sm"
              variant="primary"
              onClick={() => navigate("/user/business")}
            >
              Back to Business
            </Button>
          </div>

          <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div><strong>Name:</strong> {fallback(user.name)}</div>
              <div><strong>Email Address:</strong> {fallback(user.emailAddress)}</div>
              <div><strong>Status:</strong> {user.status ? "Active" : "Inactive"}</div>
              <div><strong>Created At:</strong> {formatDate(user.createsAt)}</div>
              <div><strong>Gender:</strong> {fallback(user.gender)}</div>
              <div><strong>Country:</strong> {user.countryData?.name ?? "N/A"}</div>
              <div><strong>State:</strong> {user.stateData?.name ?? "N/A"}</div>
              <div><strong>City:</strong> {user.cityData?.name ?? "N/A"}</div>
            </div>
          </div>
        </div>

        {/* Brand + Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Brand Box */}
          {/* <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="flex items-center justify-between px-6 py-4">
              <h3 className="text-base font-medium text-gray-800 dark:text-white/90">Brand Data</h3>
            </div>
            <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
              <div className="grid grid-cols-1 gap-4 text-sm">
                <div><strong>Brand Name:</strong> {fallback(user.brandData?.name)}</div>
                <div><strong>Brand Status:</strong> {user.brandData?.status ? "Active" : "Inactive"}</div>
              </div>
            </div>
          </div> */}

          {/* Brand Box */}
            <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
              <div className="flex items-center justify-between px-6 py-4">
                <h3 className="text-base font-medium text-gray-800 dark:text-white/90">Brand Data</h3>
              </div>
              <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
                {user.brandData ? (
                  <div className="grid grid-cols-1 gap-4 text-sm">
                    <div><strong>Brand Name:</strong> {user.brandData.name || "Not provided"}</div>
                    <div>
                      <strong>Brand Status:</strong>{" "}
                      {user.brandData.status ? "Active" : "Inactive"}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No brand data available.</p>
                )}
              </div>
            </div>

          {/* Categories & Subcategories */}
          <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="flex items-center justify-between px-6 py-4">
              <h3 className="text-base font-medium text-gray-800 dark:text-white/90">Categories & Subcategories</h3>
            </div>
            <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
              <div className="space-y-4 text-sm">
                {(user.categories && user.categories.length > 0) ? (
                  user.categories.map((cat: any, i: number) => (
                    <div key={i}>
                      <div className="font-semibold text-gray-800 dark:text-white"> {cat.categoryName} </div>
                      {(cat.subcategories && cat.subcategories.length > 0) ? (
                        <ul className="list-disc list-inside pl-4 text-gray-600 dark:text-white/80">
                          {cat.subcategories.map((sub: any, j: number) => (
                            <li key={j}>{sub.subCategoryName}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-400 italic">No subcategories</p>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 italic">No categories available</p>
                )}
              </div>
            </div>
          </div>


          {/* Earning Box */}
          <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="flex items-center justify-between px-6 py-4">
              <h3 className="text-base font-medium text-gray-800 dark:text-white/90">Earning Data</h3>
            </div>
            <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
              <div className="grid grid-cols-1 gap-4 text-sm">
               {/* <div><strong>Total Earnings:</strong> ₹{fallback(user.earningsSummary?.totalEarnings ?? 0)}</div>
                <div><strong>Withdraw Amount:</strong> ₹{user.earningsSummary?.totalWithdraw ?? 0}</div> */}
                <div><strong>Expenses Amount:</strong> ₹{user.earningsSummary?.totalExpenses ?? 0}</div>
                {/* <div><strong>Net Earning Amount:</strong> ₹{user.earningsSummary?.netEarning ?? 0}</div> */}

              </div>
            </div>
          </div>

        

{/* Badges Box */}
<div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
  <div className="flex items-center justify-between px-6 py-4">
    <h3 className="text-base font-medium text-gray-800 dark:text-white/90">Badges Data</h3>
  </div>

  <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6 space-y-4 text-sm">
    {Array.isArray(user.badges) && user.badges.length > 0 ? (
      user.badges.map((badge: any, index: number) => (
        <div
          key={badge.id || index}
          className="rounded-lg border border-gray-200 p-4 dark:border-gray-700 bg-white dark:bg-white/5"
        >
          <div className="flex items-center gap-4 mb-2">
            <img
              src={badge.image || "/images/icons/placeholder.svg"}
              alt={badge.title}
              className="w-10 h-10 rounded-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/images/icons/placeholder.svg";
              }}
            />
            <div className="font-medium text-gray-800 dark:text-white">
              {badge.title || "Untitled Badge"}
            </div>
          </div>
          <div><strong>Badge Type:</strong> {badge.type || "Not provided"}</div>
          <div>
            <strong>Status:</strong>{" "}
            <span className={badge.status ? "text-green-600" : "text-red-500"}>
              {badge.status ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
      ))
    ) : (
      <p className="text-sm text-gray-500">No badge data available.</p>
    )}
  </div>
</div>



        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}
