import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Preloader from "../../components/common/Preloader";
import Button from "../../components/ui/button/Button";
import { FetchData } from "../../utils/FetchData";

export default function InfluencerView() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bannerStatusLoading, setBannerStatusLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const userId = searchParams.get("id");

  useEffect(() => {
    if (!userId) {
      toast.error("No influencer ID provided.");
      navigate("/user/influencer");
      return;
    }

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
        const bannerResult = await FetchData("/user/getByUserId", "POST", { userId: userId }) as {
          status: boolean;
          data: {
             status: boolean; 
          };
          message?: string;
        };
        if (result.status && result.data.user) {
          const mergedUser = {
            ...result.data.user,
            earningsSummary: result.data.earningsSummary || {},
            badges: result.data.badges || [], 
            brandData: result.data.brandData || null, 

            bannerStatus: bannerResult.data?.status ?? null,
          };
          
          setUser(mergedUser);
        } else {
          toast.error(result.message || "User not found.");
          navigate("/user/influencer");
        }
      } catch (error) {
        toast.error("Failed to fetch influencer user.");
        navigate("/user/influencer");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId, navigate]);

  const handleBannerStatusToggle = async () => {
    if (!userId) return;

    setBannerStatusLoading(true);
    try {
      const result = await FetchData("/user/bannerStatus", "POST", {
        userId: userId,
        status: !user.bannerStatus // Toggle the current status
      }) as {
        status: boolean;
        message?: string;
      };

      if (result.status) {
        // Update the user state with new banner status
        setUser((prevUser: any) => ({
          ...prevUser,
          bannerStatus: !prevUser.bannerStatus
        }));
        
        toast.success(`User ${!user.bannerStatus ? 'added to' : 'removed from'} banner successfully!`);
      } else {
        toast.error(result.message || "Failed to update banner status.");
      }
    } catch (error) {
      console.error("Error updating banner status:", error);
      toast.error("Failed to update banner status.");
    } finally {
      setBannerStatusLoading(false);
    }
  };

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
      <PageMeta title="Influencer View" description="Influencer user detail" />
      <PageBreadcrumb pageTitle="Influencer Detail" />

      <div className="space-y-6">
        {/* Main Info Card */}
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex items-center justify-between px-6 py-5">
            <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
              Influencer Detail
            </h3>
            <div className="flex items-center gap-3">
              {/* Banner Status Toggle Button */}
              <Button
                size="sm"
                variant={user.bannerStatus ? "outline" : "primary"}
                onClick={handleBannerStatusToggle}
                disabled={bannerStatusLoading}
              >
                {bannerStatusLoading ? (
                  "Updating..."
                ) : user.bannerStatus ? (
                  "Remove from Banner"
                ) : (
                  "Add to Banner"
                )}
              </Button>
              
              <Button
                size="sm"
                variant="primary"
                onClick={() => navigate("/user/influencer")}
              >
                Back to Influencer
              </Button>
            </div>
          </div>

          <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
            <div className="space-y-6">
              {/* Banner Status Indicator */}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm font-medium text-gray-700 dark:text-white/80">
                  Banner Status:
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  user.bannerStatus 
                    ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                    : "bg-gray-100 text-gray-800 dark:bg-gray-800/20 dark:text-gray-400"
                }`}>
                  {user.bannerStatus ? "Active" : "Inactive"}
                </span>
              </div>

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
        </div>

        {/* Brand + Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
              {user?.earningsSummary ? (
                <div className="grid grid-cols-1 gap-4 text-sm">
                  <div><strong>Total Earnings:</strong> ₹{user.earningsSummary.totalEarnings}</div>
                  <div><strong>Withdraw Amount:</strong> ₹{user.earningsSummary.totalWithdraw}</div>
                  <div><strong>Expenses Amount:</strong> ₹{user.earningsSummary.totalExpenses}</div>
                  <div><strong>Net Earning Amount:</strong> ₹{user.earningsSummary.netEarning}</div>
                </div>
              ) : (
                <div className="text-sm text-gray-500">No earning data available.</div>
              )}
            </div>
          </div>

          {/* Badges Box */}
          <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="flex items-center justify-between px-6 py-4">
              <h3 className="text-base font-medium text-gray-800 dark:text-white/90">Badges Data</h3>
            </div>
            <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
              {Array.isArray(user?.badges) && user.badges.length > 0 ? (
                <div className="space-y-4 text-sm">
                  {user.badges.map((badge: any, index: number) => (
                    <div key={index} className="flex items-start gap-4 border rounded-lg p-4">
                      {/* Badge Image */}
                      <img
                        src={badge.image || "/images/icons/default-badge.svg"}
                        alt={badge.title || "Badge"}
                        className="h-12 w-12 object-contain rounded-full border"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/images/icons/default-badge.svg";
                        }}
                      />

                      {/* Badge Details */}
                      <div className="space-y-1">
                        <div><strong>Badge Title:</strong> {badge.title || "Not provided"}</div>
                        <div><strong>Badge Type:</strong> {badge.type || "Not provided"}</div>
                        <div>
                          <strong>Status:</strong>{" "}
                          <span className={badge.status ? "text-green-600" : "text-red-500"}>
                            {badge.status ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
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