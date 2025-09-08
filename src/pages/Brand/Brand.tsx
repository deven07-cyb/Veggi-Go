import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import AdvancedTable from "../../components/tables/AdvancedTables/AdvancedTable";
import { Brand, BrandResponse } from "../../Types/Brand";
import { Pagination } from "../../Types/Pagination";
import Preloader from "../../components/common/Preloader";
import { FetchData } from "../../utils/FetchData";
import { ToastContainer, toast } from 'react-toastify';
import ConfirmPopup from "../../components/common/ConfirmPopup";

export default function BrandList() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [deleteId, setDeleteId] = useState<string>("");
  const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleEdit = (brand: Brand) => {
    navigate(`/brand/detail?id=${brand.id}`);
  };

  const columns = [
    {
      header: 'Name',
      accessorKey: 'name',
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (info: any) => info.getValue() ? 'Active' : 'Inactive',
    },
    {
      header: 'Date & Time',
      accessorKey: 'createsAt',
      cell: (info: any) => new Date(info.getValue()).toLocaleDateString(),
    },
    {
      header: 'Actions',
      accessorKey: 'actions',
      cell: (info: any) => (
        <div className="flex items-center justify-left gap-2">
          <button
            onClick={() => handleEdit(info.row.original)}
            className="text-blue-500 hover:text-blue-700 relative group bg-blue-100 hover:bg-blue-200 p-2 rounded-lg dark:bg-blue-900/20 dark:hover:bg-blue-900/30 before:content-[attr(data-tooltip)] before:absolute before:bottom-full before:left-1/2 before:-translate-x-1/2 before:rounded-lg before:font-inter before:px-2 before:py-1 before:text-[0.6875rem] before:max-w-[300px] before:break-words before:font-medium before:bg-[#131920] before:text-white before:opacity-0 before:invisible hover:before:opacity-100 hover:before:visible before:transition-all before:duration-200 before:z-50 before:whitespace-nowrap before:mb-1"
            data-tooltip="Edit"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" className="size-[18px]">
              <path d="M11 2H9C4 2 2 4 2 9v6c0 5 2 7 7 7h6c5 0 7-2 7-7v-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M16.04 3.02 8.16 10.9c-.3.3-.6.89-.66 1.32l-.43 3.01c-.16 1.09.61 1.85 1.7 1.7l3.01-.43c.42-.06 1.01-.36 1.32-.66l7.88-7.88c1.36-1.36 2-2.94 0-4.94-2-2-3.58-1.36-4.94 0Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M14.91 4.15a7.144 7.144 0 0 0 4.94 4.94" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <button
            onClick={() => handleDelete(info.row.original.id)}
            className="text-red-500 hover:text-red-700 relative group bg-red-100 hover:bg-red-200 p-2 rounded-lg dark:bg-red-900/20 dark:hover:bg-red-900/30 before:content-[attr(data-tooltip)] before:absolute before:bottom-full before:left-1/2 before:-translate-x-1/2 before:rounded-lg before:font-inter before:px-2 before:py-1 before:text-[0.6875rem] before:max-w-[300px] before:break-words before:font-medium before:bg-[#131920] before:text-white before:opacity-0 before:invisible hover:before:opacity-100 hover:before:visible before:transition-all before:duration-200 before:z-50 before:whitespace-nowrap before:mb-1"
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

  const handleDelete = async (id: string) => {
    setDeleteId(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await FetchData(`/brand-type/delete/${deleteId}`, 'DELETE');
      if (response.status) {
        toast.success("Business Type Deleted Successfully!");
        fetchBrands(currentPage, rowsPerPage);
      } else {
        toast.error(response.message || "Failed to delete Business Type");
      }
    } catch (error) {
      console.error('Error deleting Business Type:', error);
      toast.error("Failed to delete Business Type.");
    } finally {
      setIsConfirmOpen(false);
      setDeleteId("");
    }
  };

  const fetchBrands = async (page: number, limit: number) => {
    setLoading(true);
    try {
      const result = await FetchData<BrandResponse>('/brand-type/getAll', 'POST', { page, limit });
      if (result.status) {
        const sorted = result.data.Brands.sort(
          (a: Brand, b: Brand) => new Date(b.createsAt).getTime() - new Date(a.createsAt).getTime()
        );
        setBrands(sorted);
        setPagination({
          total: result.data.pagination.total,
          currentPage: result.data.pagination.page,
          limit: result.data.pagination.limit,
          totalPages: result.data.pagination.totalPages
        });
      } else {
        throw new Error(result.message || 'Fetch failed');
      }
    } catch (error) {
      console.error("Failed to fetch Business Type:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands(currentPage, rowsPerPage);
  }, [currentPage, rowsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRowsPerPageChange = (limit: number) => {
    setRowsPerPage(limit);
    setCurrentPage(1);
  };

  const searchBrands = (brand: Brand, searchTerm: string) => {
    const term = searchTerm.toLowerCase();
    return (
      brand.name?.toLowerCase().includes(term) ||
      (typeof brand.status === 'boolean' &&
        (brand.status ? 'active' : 'inactive').includes(term))
    );
  };

  const addButton = {
    label: "Add Business Type",
    slug: "/brand/detail"
  };

  if (loading) return <Preloader />;

  return (
    <>
      <PageMeta title="Business Type List" description="Business Type List" />
      <PageBreadcrumb pageTitle="Business Type List" />
      <div className="space-y-6">
        <ComponentCard title="Business Type List">
          <AdvancedTable
            addButton={addButton}
            data={brands}
            columns={columns}
            loading={loading}
            pagination={pagination}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            searchFunction={searchBrands}
            type="earning"
          />
        </ComponentCard>
      </div>

      <ConfirmPopup
        isOpen={isConfirmOpen}
        message="Are you sure you want to delete this Business Type?"
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsConfirmOpen(false)}
        title="Delete Business Type"
        confirmText="Delete"
        cancelText="Cancel"
      />

      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="light"
        closeButton={false}
        toastStyle={{
          padding: "16px",
          margin: "8px 0",
          borderRadius: "8px",
          boxShadow: "none",
          minHeight: "auto"
        }}
      />
    </>
  );
}
