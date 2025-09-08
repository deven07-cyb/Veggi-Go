import { useEffect, useState } from "react";
// import { useNavigate } from 'react-router-dom';
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import AdvancedTable from "../../components/tables/AdvancedTables/AdvancedTable";
import { AbuseReport, AbuseReportResponse } from "../../Types/AbuseReport";
import { Pagination } from "../../Types/Pagination";
import Preloader from "../../components/common/Preloader";
import { FetchData } from "../../utils/FetchData";
import { ToastContainer } from 'react-toastify';

export default function AbuseReportList() {
    const [reports, setReports] = useState<AbuseReport[]>([]);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);

    // const navigate = useNavigate();

    const columns = [
        {
            header: 'Reported By',
            accessorKey: 'abuseReportedByData.name',
            // cell: (info: any) => info.row.original.abuseReportedByData?.name || '-',
            cell: ({ row }: any) => {
                const reportedBy = row.original.abuseReportedByData;
                const name = reportedBy?.name || '-';
                const email = reportedBy?.emailAddress || '-';
                return (
                    <div>
                        <div>{name}</div>
                        <div style={{ fontSize: '12px', color: '#555' }}>{email}</div>
                    </div>
                );
            },
        },
        {
            header: 'Reported User',
            accessorKey: 'abuseReportedUserData.name',
            // cell: (info: any) => info.row.original.abuseReportedUserData?.name || '-',
            cell: ({ row }: any) => {
                const reportedUser = row.original.abuseReportedUserData;
                const name = reportedUser?.name || '-';
                const email = reportedUser?.emailAddress || '-';
                return (
                    <div>
                        <div>{name}</div>
                        <div style={{ fontSize: '12px', color: '#555' }}>{email}</div>
                    </div>
                );
            },
        },
        {
            header: 'Reported Group',
            accessorKey: 'abuseReportedGroupData.groupName',
            cell: (info: any) => info.row.original.abuseReportedGroupData?.groupName || '-',
        },
        {
            header: 'Type of User',
            accessorKey: 'status',
        },
        {
            header: 'Date & Time',
            accessorKey: 'createdAt',
            cell: (info: any) => new Date(info.getValue()).toLocaleDateString(),
        },
    ];

    const fetchReports = async (page: number, limit: number) => {
        setLoading(true);
        try {
            const result = await FetchData<AbuseReportResponse>('/report/getAll', 'POST', { page, limit });
            if (result.status) {
                const sorted = result.data.reports.sort(
                    (a: AbuseReport, b: AbuseReport) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );
                setReports(sorted);
                setPagination({
                    total: result.data.total,
                    currentPage: result.data.page,
                    limit: result.data.limit,
                    totalPages: result.data.totalPages,
                });
            } else {
                throw new Error(result.message || 'Fetch failed');
            }
        } catch (error) {
            console.error("Failed to fetch abuse reports:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports(currentPage, rowsPerPage);
    }, [currentPage, rowsPerPage]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleRowsPerPageChange = (limit: number) => {
        setRowsPerPage(limit);
        setCurrentPage(1);
    };

    const searchReports = (report: AbuseReport, searchTerm: string) => {
        const term = searchTerm.toLowerCase();
        return (
            report.abuseReportedByData?.name?.toLowerCase().includes(term) ||
            report.abuseReportedUserData?.name?.toLowerCase().includes(term) ||
            report.abuseReportedGroupData?.groupName?.toLowerCase().includes(term) ||
            report.status.toLowerCase().includes(term)
        );
    };

    if (loading) return <Preloader />;

    return (
        <>
            <PageMeta title="Abuse Report List" description="Abuse Report List" />
            <PageBreadcrumb pageTitle="Abuse Report List" />
            <div className="space-y-6">
                <ComponentCard title="Abuse Report List">
                    <AdvancedTable
                        data={reports}
                        columns={columns}
                        loading={loading}
                        pagination={pagination}
                        onPageChange={handlePageChange}
                        onRowsPerPageChange={handleRowsPerPageChange}
                        searchFunction={searchReports}
                    // type="abuseReport"
                    />
                </ComponentCard>
            </div>

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
