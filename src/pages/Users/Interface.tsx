import { useEffect, useState, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import AdvancedTable from "../../components/tables/AdvancedTables/AdvancedTable";
import Preloader from "../../components/common/Preloader";
import { useNavigate } from 'react-router-dom';
import ConfirmPopup from "../../components/common/ConfirmPopup";
import { Business, BusinessUserResponse } from "../../Types/User";
import { Pagination } from "../../Types/Pagination";
import { FetchData } from "../../utils/FetchData";
import { authToken } from "../../utils/Auth";

export default function InfluencerList() {
  const [influencerUser, setInfluencerUser] = useState<Business[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const currentPage = 1;
  const navigate = useNavigate();
  const [deleteId, setDeleteId] = useState<string>("");
  const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);


  const fetchUserInfluencer = async (page: number, search = '') => {
    setLoading(true);
    try {
      const result = await FetchData<BusinessUserResponse>(
        "/user/getAllInfo",
        "POST",
        { page, limit: 10, type: "INFLUENCER", search: search }
      );

      if (result.status) {
        setInfluencerUser(result.data.Users);
        setPagination({
          total: result.data.pagination.total,
          currentPage: result.data.pagination.page,
          limit: result.data.pagination.limit,
          totalPages: result.data.pagination.totalPages,
        });
      }
    } catch (error) {
      console.error("Failed to fetch influencer users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = async (page: number) => {
    fetchUserInfluencer(page);
  };

  const handleView = (id: string) => {
    navigate(`/user/influencer/view?id=${id}`);
  };

  const handleDelete = async (id: string) => {
    setDeleteId(id);
    setIsConfirmOpen(true);
  };
  const handleConfirmDelete = async () => {
    const token = authToken();
    if (!token) return;

    try {
      const response = await FetchData(
        "/user/delete",
        "DELETE",
        { id: deleteId },
        { Authorization: `Bearer ${token}` }
      );
      if (response.status) {
        toast.success("User Deleted Successfully!");
        fetchUserInfluencer(currentPage);
      } else {
        toast.error(response.message || "Failed to delete user.");
      }
    } catch (error) {
      toast.error("Something went wrong.");
      console.error(error);
    } finally {
      setIsConfirmOpen(false);
      setDeleteId("");
    }
  };

  const searchInfluencer = (item: Business, searchTerm: string) => {
    const term = searchTerm.toLowerCase();
    return (
      (item.name && item.name.toLowerCase().includes(term)) ||
      (item.emailAddress && item.emailAddress.toLowerCase().includes(term)) ||
      (typeof item.status === "boolean" &&
        (item.status ? "active" : "inactive").includes(term))
    );
  };

  const hasFetched = useRef(false);
  useEffect(() => {
    if (!hasFetched.current) {
      fetchUserInfluencer(currentPage);
      hasFetched.current = true;
    }
  }, [currentPage]);

  const exportRow = (item: Business) => ({
    "Name": item.name,
    "Email Address": item.emailAddress,
    "Status": item.status ? "Active" : "Inactive",
    "Created At": item.createsAt
      ? new Date(item.createsAt).toLocaleDateString("en-IN")
      : "N/A",
  });

  const columns = [
    {
      header: "Image",
      accessorKey: "image",
      cell: (info: any) => (
        <div className="flex items-center justify-left">
          <img
            src={info.row.original.userImage || "/images/icons/user-circle.svg"}
            alt="Influencer"
            className="h-10 w-10 rounded-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/images/icons/user-circle.svg";
            }}
          />
        </div>
      ),
    },
    { header: "Name", accessorKey: "name" },
    { header: "Email Address", accessorKey: "emailAddress" },
    {
      header: "Status",
      accessorKey: "status",
      cell: (info: any) => (info.getValue() ? "Active" : "Inactive"),
    },
    {
      header: "Date & Time",
      accessorKey: "createsAt",
      cell: (info: any) =>
        info.getValue()
          ? new Date(info.getValue()).toLocaleDateString()
          : "N/A",
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: (info: any) => {
        const user = info.row.original;

        return (
          <div className="flex items-center justify-start gap-2 min-h-[40px]">
            {/* View Button — hidden with 'invisible' to preserve spacing */}
            <button
              onClick={() => user.status && handleView(user.id)}
              className={`text-blue-500 hover:text-blue-700 bg-blue-100 hover:bg-blue-200 p-2 rounded-lg ${user.status ? "" : "invisible"
                }`}
              data-tooltip="View"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            </button>

            {/* Delete Button */}
            {user.status === true && (
              <button
                onClick={() => handleDelete(user.id)}
                className="text-red-500 hover:text-red-700 relative group bg-red-100 hover:bg-red-200 p-2 rounded-lg dark:bg-red-900/20 dark:hover:bg-red-900/30 before:content-[attr(data-tooltip)] before:absolute before:bottom-full before:left-1/2 before:-translate-x-1/2 before:rounded-lg before:font-inter before:px-2 before:py-1 before:text-[0.6875rem] before:max-w-[300px] before:break-words before:font-medium before:bg-[#131920] before:text-white before:opacity-0 before:invisible hover:before:opacity-100 hover:before:visible before:transition-all before:duration-200 before:z-50 before:whitespace-nowrap before:mb-1"
                data-tooltip="Delete"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="size-[18px]"
                >
                  <path
                    d="M21 5.98c-3.33-.33-6.68-.5-10.02-.5-1.98 0-3.96.1-5.94.3L3 5.98M8.5 4.97l.22-1.31C8.88 2.71 9 2 10.69 2h2.62c1.69 0 1.82.75 1.97 1.67l.22 1.3M18.85 9.14l-.65 10.07C18.09 20.78 18 22 15.21 22H8.79C6 22 5.91 20.78 5.8 19.21L5.15 9.14M10.33 16.5h3.33M9.5 12.5h5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            )}
          </div>
        );
      },
    }

  ];

  return (
    <>
      <PageMeta title="Influencer List" description="Influencer List" />
      <PageBreadcrumb pageTitle="Influencer" />
      <div className="space-y-6">
        <ComponentCard title="Influencer List">
          {loading ? (
            <Preloader />
          ) : (
            <AdvancedTable
              data={influencerUser}
              columns={columns}
              loading={loading}
              pagination={pagination}
              onPageChange={handlePageChange}
              searchFunction={searchInfluencer}
              exportRow={exportRow}
              type="influencer"
              enableSearch={true}
              onSearch={(search) => fetchUserInfluencer(1, search)}
            />
          )}
        </ComponentCard>
      </div>

      <ConfirmPopup
        isOpen={isConfirmOpen}
        message="Are you sure you want to delete this user?"
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsConfirmOpen(false)}
        title="Delete User"
        confirmText="Delete"
        cancelText="Cancel"
      />

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        pauseOnHover
        theme="light"
        closeButton={false}
        style={{ width: "auto" }}
        toastStyle={{
          padding: "16px",
          margin: "8px 0",
          borderRadius: "8px",
          boxShadow: "none",
          minHeight: "auto",
        }}
      />
    </>
  );
}
