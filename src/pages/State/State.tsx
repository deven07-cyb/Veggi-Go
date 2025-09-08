import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import AdvancedTable from "../../components/tables/AdvancedTables/AdvancedTable";
import { State, StateResponse } from "../../Types/State";
import { Country, CountryResponse } from "../../Types/Country";
import { Pagination } from "../../Types/Pagination";
import Preloader from "../../components/common/Preloader";
import { FetchData } from "../../utils/FetchData";
import { ToastContainer, toast } from 'react-toastify';
import ConfirmPopup from "../../components/common/ConfirmPopup";

export default function StateList() {
  const [states, setStates] = useState<State[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [deleteId, setDeleteId] = useState<string>("");
  const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);
  const [countryMap, setCountryMap] = useState<{ [key: string]: string }>({});

  const navigate = useNavigate();

  const handleEdit = (state: State) => {
    navigate(`/state/detail?id=${state.id}`);
  };

  const exportRow = (item: State) => ({
    Name: item.name,
    "Country Name": countryMap[item.countryId] || "N/A",
    Status: item.status ? "Active" : "Inactive",
    "Created At": item.createsAt ? new Date(item.createsAt).toLocaleDateString() : "N/A",
  });

  const columns = [
    { header: 'Name', accessorKey: 'name' },
    {
      header: 'Country Name',
      accessorKey: 'countryId',
      cell: (info: any) => countryMap[info.getValue()] || 'N/A',
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (info: any) => info.getValue() ? 'Active' : 'Inactive',
    },
    {
      header: 'Date & Time',
      accessorKey: 'createsAt',
      cell: (info: any) =>
        info.getValue() ? new Date(info.getValue()).toLocaleDateString() : 'N/A',
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
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" className="size-[18px]">
              <path d="M11 2H9C4 2 2 4 2 9v6c0 5 2 7 7 7h6c5 0 7-2 7-7v-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
              <path d="M16.04 3.02 8.16 10.9c-.3.3-.6.89-.66 1.32l-.43 3.01c-.16 1.09.61 1.85 1.7 1.7l3.01-.43c.42-.06 1.01-.36 1.32-.66l7.88-7.88c1.36-1.36 2-2.94 0-4.94-2-2-3.58-1.36-4.94 0Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
              <path d="M14.91 4.15a7.144 7.144 0 0 0 4.94 4.94" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
          </button>

          <button
            onClick={() => handleDelete(info.row.original.id)}
            className="text-red-500 hover:text-red-700 relative group bg-red-100 hover:bg-red-200 p-2 rounded-lg dark:bg-red-900/20 dark:hover:bg-red-900/30"
            data-tooltip="Delete"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" className="size-[18px]">
              <path d="M21 5.98c-3.33-.33-6.68-.5-10.02-.5-1.98 0-3.96.1-5.94.3L3 5.98M8.5 4.97l.22-1.31C8.88 2.71 9 2 10.69 2h2.62c1.69 0 1.82.75 1.97 1.67l.22 1.3M18.85 9.14l-.65 10.07C18.09 20.78 18 22 15.21 22H8.79C6 22 5.91 20.78 5.8 19.21L5.15 9.14M10.33 16.5h3.33M9.5 12.5h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      ),
    },
  ];

  const fetchStates = async (page: number, limit: number) => {
    setLoading(true);
    try {
      const result = await FetchData<StateResponse>('/state/getAll', 'POST', { page, limit });
      if (result.status && result.data?.items) {
        const sorted = result.data.items.sort((a, b) =>
          new Date(b.createsAt).getTime() - new Date(a.createsAt).getTime()
        );
        setStates(sorted);
        setPagination({
          total: result.data.pagination.total,
          currentPage: result.data.pagination.page,
          limit: result.data.pagination.limit,
          totalPages: result.data.pagination.totalPages,
        });
      }
    } catch (err) {
      console.error("Fetch states failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCountries = async () => {
    try {
      const result = await FetchData<CountryResponse>('/country/getAll', 'POST', { page: 1, limit: 999 });
      if (result.status && result.data?.countries) {
        const map: { [key: string]: string } = {};
        result.data.countries.forEach((c: Country) => {
          map[c.id] = c.name;
        });
        setCountryMap(map);
      }
    } catch (err) {
      console.error("Failed to fetch countries", err);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleteId(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await FetchData(`/state/delete/${deleteId}`, 'DELETE', { id: deleteId });
      if (response.status) {
        toast.success("State deleted successfully!");
        fetchStates(currentPage, rowsPerPage);
      } else {
        toast.error("Failed to delete state.");
      }
    } catch (error) {
      toast.error("Error deleting state.");
    } finally {
      setDeleteId("");
      setIsConfirmOpen(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRowsPerPageChange = (limit: number) => {
    setRowsPerPage(limit);
    setCurrentPage(1);
  };

  const searchStates = (state: State, searchTerm: string) => {
    const term = searchTerm.toLowerCase();
    return (
      state.name.toLowerCase().includes(term) ||
      (countryMap[state.countryId]?.toLowerCase().includes(term) ?? false) ||
      (state.status ? "active" : "inactive").includes(term)
    );
  };

  useEffect(() => {
    fetchCountries();
    fetchStates(currentPage, rowsPerPage);
  }, [currentPage, rowsPerPage]);

  if (loading) return <Preloader />;

  return (
    <>
      <PageMeta title="State List" description="State list and management" />
      <PageBreadcrumb pageTitle="States" />
      <ComponentCard title="State List">
        <AdvancedTable
          addButton={{ label: "Add State", slug: "/state/detail" }}
          data={states}
          columns={columns}
          loading={loading}
          pagination={pagination}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          searchFunction={searchStates}
          exportRow={exportRow}
          type="state"
        />
      </ComponentCard>

      <ConfirmPopup
        isOpen={isConfirmOpen}
        message="Are you sure you want to delete this state?"
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsConfirmOpen(false)}
        title="Delete State"
        confirmText="Delete"
        cancelText="Cancel"
      />

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}
