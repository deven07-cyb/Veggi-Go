import { useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import AdvancedTable from "../../components/tables/AdvancedTables/AdvancedTable";
import { Contact, ContactResponse } from "../../Types/Contact";
import { Pagination } from "../../Types/Pagination";
import Preloader from "../../components/common/Preloader";
import { FetchData } from "../../utils/FetchData";
import { ToastContainer, toast } from 'react-toastify';
import ConfirmPopup from "../../components/common/ConfirmPopup";

export default function ContactList() {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [deleteId, setDeleteId] = useState<string>("");
    const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);

    // const navigate = useNavigate();

    const handleDelete = async (id: string) => {
        setDeleteId(id);
        setIsConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        try {
            const response = await FetchData(
                `/contact/delete/${deleteId}`,
                'DELETE',
                { id: deleteId }
            );

            if (response.status) {
                toast.success("Contact Deleted Successfully!", {
                    style: {
                        backgroundColor: "#F0FDF4",
                        color: "#166534"
                    }
                });
                fetchContacts(currentPage, rowsPerPage);
            } else {
                toast.error(response.message || "Failed to delete contact", {
                    style: {
                        backgroundColor: "#FEF2F2",
                        color: "#991B1B"
                    }
                });
            }
        } catch (error) {
            console.error('Error deleting contact:', error);
            toast.error("Failed to delete contact.", {
                style: {
                    backgroundColor: "#FEF2F2",
                    color: "#991B1B"
                }
            });
        } finally {
            setIsConfirmOpen(false);
            setDeleteId("");
        }
    };

    const fetchContacts = async (page: number, limit: number) => {
        setLoading(true);
        try {
            const result = await FetchData<ContactResponse>('/contact/getAll', 'POST', { page, limit });

            if (result?.status && result.data?.contactRequests) {
                const sortedContacts = result.data.contactRequests.sort((a, b) =>
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );
                setContacts(sortedContacts);
                setPagination({
                    total: result.data.pagination?.total || 0,
                    currentPage: result.data.pagination?.page || 1,
                    limit: result.data.pagination?.limit || 10,
                    totalPages: result.data.pagination?.totalPages || 1
                });
            } else {
                setContacts([]);
            }
        } catch (error) {
            console.error("Failed to fetch contacts:", error);
            setContacts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContacts(currentPage, rowsPerPage);
    }, [currentPage, rowsPerPage]);

    const columns = [
        {
            header: 'Name',
            // accessorKey: 'name',
            accessorKey: 'name', 
            cell: ({ row }: any) => {
                const name = row.original.name;
                const email = row.original.emailAddress;
                return (
                    <div>
                        <div>{name}</div>
                        <div style={{ fontSize: '12px', color: '#555' }}>{email}</div>
                    </div>
                );
            },

        },
        {
            header: 'Title',
            accessorKey: 'title',
        },
        {
            header: 'Description',
            accessorKey: 'description',
            cell: ({ row }: any) => {
                const description = row.original.description;
                return (
                    <div style={{
                        textAlign: 'left',
                        // margin: '0 auto',
                        width: '350px',
                        whiteSpace: 'normal',
                        wordBreak: 'break-word'
                    }}>
                        {description}
                    </div>
                );
            },
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

    const exportRow = (item: Contact) => ({
        "Name": item.name,
        "Email Address": item.emailAddress,
        "Title": item.title,
        "Description": item.description,
        "Created At": item.createdAt
            ? new Date(item.createdAt).toLocaleDateString()
            : "N/A",
    });

    const searchContacts = (contact: Contact, searchTerm: string) => {
        const term = searchTerm.toLowerCase();
        return (
            contact.name.toLowerCase().includes(term) ||
            contact.title?.toLowerCase().includes(term) ||
            contact.email?.toLowerCase().includes(term)
        );
    };

    if (loading) {
        return <Preloader />;
    }

    return (
        <>
            <PageMeta title="Contact List" description="List of contacts" />
            <PageBreadcrumb pageTitle="Contact Us" />
            <div className="space-y-6">
                <ComponentCard title="Contact List">
                    <AdvancedTable
                        data={contacts}
                        columns={columns}
                        loading={loading}
                        pagination={pagination}
                        onPageChange={(page) => setCurrentPage(page)}
                        onRowsPerPageChange={(limit) => { setRowsPerPage(limit); setCurrentPage(1); }}
                        searchFunction={searchContacts}
                        exportRow={exportRow}
                        type="contact"
                    />
                </ComponentCard>
            </div>
            <ConfirmPopup
                isOpen={isConfirmOpen}
                message="Are you sure you want to delete this contact?"
                onConfirm={handleConfirmDelete}
                onCancel={() => setIsConfirmOpen(false)}
                title="Delete Contact"
                confirmText="Delete"
                cancelText="Cancel"
            />
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar
                closeOnClick
                pauseOnHover
                draggable={false}
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
