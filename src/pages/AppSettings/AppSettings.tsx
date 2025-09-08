import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import AdvancedTable from "../../components/tables/AdvancedTables/AdvancedTable";
import { AppSetting, AppSettingResponse } from "../../Types/AppSettings";
import { Pagination } from "../../Types/Pagination";
import Preloader from "../../components/common/Preloader";
import { FetchData } from "../../utils/FetchData";
import { ToastContainer, toast } from 'react-toastify';
import ConfirmPopup from "../../components/common/ConfirmPopup";

export default function AppSettingList() {
  const [settings, setSettings] = useState<AppSetting[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [deleteId, setDeleteId] = useState<string>("");
  const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleEdit = (setting: AppSetting) => {
    navigate(`/app-settings/detail?id=${setting.id}`);
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await FetchData(`/app-data/delete/${deleteId}`, 'DELETE');
      if (response.status) {
        toast.success("App Setting Deleted Successfully!", {
          style: { backgroundColor: "#F0FDF4", color: "#166534" }
        });
        fetchData(currentPage, rowsPerPage);
      } else {
        toast.error(response.message || "Failed to delete App Setting", {
          style: { backgroundColor: "#FEF2F2", color: "#991B1B" }
        });
      }
    } catch (error) {
      console.error('Error deleting:', error);
      toast.error("Error deleting App Setting.", {
        style: { backgroundColor: "#FEF2F2", color: "#991B1B" }
      });
    } finally {
      setIsConfirmOpen(false);
      setDeleteId("");
    }
  };

  const fetchData = async (page: number, limit: number) => {
    setLoading(true);
    try {
      const result = await FetchData<AppSettingResponse>('/app-data/getAll', 'POST', { page, limit });
      const settingsData = result?.data?.appData || [];
      const paginationData = result?.data?.pagination || {};

      const sorted = settingsData.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setSettings(sorted);
      setPagination({
        total: paginationData.total || 0,
        currentPage: paginationData.page || 1,
        limit: paginationData.limit || limit,
        totalPages: paginationData.totalPages || 1
      });
    } catch (error) {
      console.error("Failed to fetch app settings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage, rowsPerPage);
  }, [currentPage, rowsPerPage]);

  const searchSettings = (setting: AppSetting, term: string) => {
    const lower = term.toLowerCase();
    return (
      setting.title?.toLowerCase().includes(lower) ||
      setting.slug?.toLowerCase().includes(lower) ||
      (typeof setting.value === 'boolean' && (setting.value ? 'active' : 'inactive').includes(lower))
    );
  };

  const exportRow = (item: AppSetting) => ({
    Title: item.title,
    Value: typeof item.value === 'boolean' ? (item.value ? 'Active' : 'Inactive') : item.value,
    'Created At': new Date(item.createdAt).toLocaleDateString()
  });

  const columns = [
    {
      header: 'Title',
      accessorKey: 'title',
    },
    {
      header: 'Value',
      accessorKey: 'value',
    },
    {
      header: 'Date & Time',
      accessorKey: 'createdAt',
      cell: (info: any) => new Date(info.getValue()).toLocaleDateString(),
    },
    {
      header: 'Actions',
      accessorKey: 'actions',
      cell: (info: any) => (
        <div className="flex items-center justify-left gap-2">
          <button
            onClick={() => handleEdit(info.row.original)}
            className="text-blue-500 hover:text-blue-700 relative group bg-blue-100 hover:bg-blue-200 p-2 rounded-lg dark:bg-blue-900/20 dark:hover:bg-blue-900/30"
            data-tooltip="Edit"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M11 2H9C4 2 2 4 2 9v6c0 5 2 7 7 7h6c5 0 7-2 7-7v-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M16.04 3.02 8.16 10.9c-.3.3-.6.89-.66 1.32l-.43 3.01c-.16 1.09.61 1.85 1.7 1.7l3.01-.43c.42-.06 1.01-.36 1.32-.66l7.88-7.88c1.36-1.36 2-2.94 0-4.94-2-2-3.58-1.36-4.94 0Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M14.91 4.15a7.144 7.144 0 0 0 4.94 4.94" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            onClick={() => handleDelete(info.row.original.id)}
            className="text-red-500 hover:text-red-700 relative group bg-red-100 hover:bg-red-200 p-2 rounded-lg dark:bg-red-900/20 dark:hover:bg-red-900/30"
            data-tooltip="Delete"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M21 5.98c-3.33-.33-6.68-.5-10.02-.5-1.98 0-3.96.1-5.94.3L3 5.98M8.5 4.97l.22-1.31C8.88 2.71 9 2 10.69 2h2.62c1.69 0 1.82.75 1.97 1.67l.22 1.3M18.85 9.14l-.65 10.07C18.09 20.78 18 22 15.21 22H8.79C6 22 5.91 20.78 5.8 19.21L5.15 9.14M10.33 16.5h3.33M9.5 12.5h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      ),
    },
  ];

  const addButton = {
    label: "Add Setting",
    slug: "/app-settings/detail"
  };

  if (loading) return <Preloader />;

  return (
    <>
      <PageMeta title="App Setting" description="App Setting" />
      <PageBreadcrumb pageTitle="App Setting" />
      <div className="space-y-6">
        <ComponentCard title="App Setting">
          <AdvancedTable
            type="app-settings"
            addButton={addButton}
            data={settings}
            columns={columns}
            loading={loading}
            pagination={pagination}
            onPageChange={setCurrentPage}
            onRowsPerPageChange={setRowsPerPage}
            searchFunction={searchSettings}
            exportRow={exportRow}
          />
        </ComponentCard>
      </div>

      <ConfirmPopup
        isOpen={isConfirmOpen}
        message="Are you sure you want to delete this App Setting?"
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsConfirmOpen(false)}
        title="Delete App Setting"
        confirmText="Delete"
        cancelText="Cancel"
      />

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}
