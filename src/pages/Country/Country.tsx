import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import AdvancedTable from "../../components/tables/AdvancedTables/AdvancedTable";
import { Country, CountryResponse } from "../../Types/Country";
import { Pagination } from "../../Types/Pagination";
import Preloader from "../../components/common/Preloader";
import { FetchData } from "../../utils/FetchData";
import { ToastContainer, toast } from 'react-toastify';
import ConfirmPopup from "../../components/common/ConfirmPopup";


const exportRow = (item: Country) => ({
  Name: item.name,
  "Country Code": item.countryCode,
  Status: item.status ? "Active" : "Inactive",
  "Created At": item.createsAt ? new Date(item.createsAt).toLocaleDateString() : "N/A",
});

export default function CountryList() {
    const [countries, setCountries] = useState<Country[]>([]);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [deleteId, setDeleteId] = useState<string>("");
    const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);

    const navigate = useNavigate();

    const handleEdit = (country: Country) => {
        navigate(`/country/detail?id=${country.id}`);
    };

    const columns = [
        {
            header: 'Name',
            accessorKey: 'name',
        },
        {
            header: 'Country Code',
            accessorKey: 'countryCode',
        },
        {
            header: 'Status',
            accessorKey: 'status',
            cell: (info: any) => info.getValue() ? 'Active' : 'Inactive',
        },
        {
            header: 'Date & Time',
            accessorKey: 'createsAt',
            cell: (info: any) => info.getValue() ? new Date(info.getValue()).toLocaleDateString() : 'N/A',
        },
        {
            header: 'Actions',
            accessorKey: 'actions',
            cell: (info: any) => (
                <div className="flex items-center justify-left  gap-2">
                    <button
                        onClick={() => handleEdit(info.row.original)}
                        className="text-blue-500 hover:text-blue-700 relative group bg-blue-100 hover:bg-blue-200 p-2 rounded-lg dark:bg-blue-900/20 dark:hover:bg-blue-900/30"
                        data-tooltip="Edit"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" className="size-[18px]">
                            <path d="M11 2H9C4 2 2 4 2 9v6c0 5 2 7 7 7h6c5 0 7-2 7-7v-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                            <path d="M16.04 3.02 8.16 10.9c-.3.3-.6.89-.66 1.32l-.43 3.01c-.16 1.09.61 1.85 1.7 1.7l3.01-.43c.42-.06 1.01-.36 1.32-.66l7.88-7.88c1.36-1.36 2-2.94 0-4.94-2-2-3.58-1.36-4.94 0Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path>
                            <path d="M14.91 4.15a7.144 7.144 0 0 0 4.94 4.94" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path>
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

    const handleDelete = async (id: string) => {
        setDeleteId(id);
        setIsConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        try {
            const response = await FetchData(
                `/country/delete/${deleteId}`,
                'DELETE',
                { id: deleteId }
            );

            if (response.status) {
                toast.success("Country Deleted Successfully!", {
                    style: { backgroundColor: "#F0FDF4", color: "#166534" }
                });
                fetchCountries(currentPage, rowsPerPage);
            } else {
                toast.error(response.message || "Failed to delete country", {
                    style: { backgroundColor: "#FEF2F2", color: "#991B1B" }
                });
            }
        } catch (error) {
            console.error('Error deleting:', error);
            toast.error("Failed to delete country.", {
                style: { backgroundColor: "#FEF2F2", color: "#991B1B" }
            });
        } finally {
            setIsConfirmOpen(false);
            setDeleteId("");
        }
    };

    const fetchCountries = async (page: number, limit: number) => {
        setLoading(true);
        try {
            const result = await FetchData<CountryResponse>('/country/getAll', 'POST', { page, limit });
            if (result.status) {
                const sortedCountry = result.data.countries.sort(
                    (a: Country, b: Country) =>
                        new Date(b.createsAt).getTime() - new Date(a.createsAt).getTime()
                );
                setCountries(sortedCountry);
                setPagination({
                    total: result.data.pagination.total,
                    currentPage: result.data.pagination.page,
                    limit: result.data.pagination.limit,
                    totalPages: result.data.pagination.totalPages
                });
            } else {
                throw new Error(result.message || 'Failed to fetch countries');
            }
        } catch (error) {
            console.error("Failed to fetch countries:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCountries(currentPage, rowsPerPage);
    }, [currentPage, rowsPerPage]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleRowsPerPageChange = (limit: number) => {
        setRowsPerPage(limit);
        setCurrentPage(1);
    };

    const searchCountries = (country: Country, searchTerm: string) => {
        const term = searchTerm.toLowerCase();
        return (
            (country.name && country.name.toLowerCase().includes(term)) ||
            (country.countryCode && country.countryCode.toLowerCase().includes(term)) ||
            (typeof country.status === 'boolean' &&
                (country.status ? 'active' : 'inactive').includes(term))
        );
    };

    if (loading) {
        return <Preloader />;
    }

    const addButton = {
        label: "Add Country",
        slug: "/country/detail"
    };

    return (
        <>
            <PageMeta title="Countries List" description="Countries List" />
            <PageBreadcrumb pageTitle="Countries" />
            <div className="space-y-6">
                <ComponentCard title="Country List">
                    <AdvancedTable
                        addButton={addButton}
                        data={countries}
                        columns={columns}
                        loading={loading}
                        pagination={pagination}
                        onPageChange={handlePageChange}
                        onRowsPerPageChange={handleRowsPerPageChange}
                        searchFunction={searchCountries}
                        type="country"
                        exportRow={exportRow} 

                    />
                </ComponentCard>
            </div>
            <ConfirmPopup
                isOpen={isConfirmOpen}
                message="Are you sure you want to delete this country?"
                onConfirm={handleConfirmDelete}
                onCancel={() => setIsConfirmOpen(false)}
                title="Delete Country"
                confirmText="Delete"
                cancelText="Cancel"
            />
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable={false}
                pauseOnHover
                theme="light"
                closeButton={false}
                style={{ width: "auto" }}
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
