import { useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard";
import AdvancedTable from "../../components/tables/AdvancedTables/AdvancedTable";
import { ToastContainer } from "react-toastify";
import Preloader from "../../components/common/Preloader";
import { FetchData } from "../../utils/FetchData";
import { Pagination } from "../../Types/Pagination";
import { Earning, EarningResponse } from "../../Types/Earning";
import { format } from "date-fns";

export default function EarningList() {
  const [earnings, setEarnings] = useState<Earning[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  const exportRow = (item: any) => {
    const order = item?.orderData || {};
    return {
      "Order Name": order?.title || "N/A",
      "Earning Amount": item?.earningAmount ? `₹${item.earningAmount}` : "N/A",
      Amount: item?.amount
        ? `₹${item.amount}`
        : order?.amount
        ? `₹${order.amount}`
        : "N/A",
      "Payment Status": item?.paymentStatus
        ? item.paymentStatus.charAt(0).toUpperCase() +
          item.paymentStatus.slice(1).toLowerCase()
        : "N/A",
      "Created At": item?.createdAt
        ? format(new Date(item.createdAt), "dd-MM-yyyy")
        : "N/A",
    };
  };

  const fetchEarnings = async (page: number, limit: number) => {
    setLoading(true);
    try {
      const result = await FetchData<EarningResponse>(
        "/dashboard/getAdminEarningsList",
        "POST",
        { page, limit }
      );

      if (result?.status && result.data?.earnings) {
        const sorted = result.data.earnings.sort(
          (a, b) => Number(b.earningAmount) - Number(a.earningAmount)
        );
        setEarnings(sorted);
        setPagination({
          total: result.data.pagination?.total || 0,
          currentPage: result.data.pagination?.page || 1,
          limit: result.data.pagination?.limit || 10,
          totalPages: result.data.pagination?.totalPages || 1,
        });
      } else {
        setEarnings([]);
      }
    } catch (error) {
      console.error("Failed to fetch earnings:", error);
      setEarnings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEarnings(currentPage, rowsPerPage);
  }, [currentPage, rowsPerPage]);

  const totalAmount = earnings.reduce(
    (acc, curr) => acc + Number(curr?.earningAmount),
    0
  );

  const columns = [
    {
      header: "Name",
      accessorKey: "orderData.title",
      cell: (info: any) => info.row.original.orderData?.title || "N/A",
    },
    {
      header: "Earning Amount",
      accessorKey: "earningAmount",
      cell: (info: any) => `₹${info.row.original.earningAmount || 0}`,
    },
    {
      header: "Amount",
      accessorKey: "amount",
      cell: (info: any) => `₹${info.row.original.amount || 0}`,
    },
    {
      header: "Payment Status",
      accessorKey: "paymentStatus",
      cell: (info: any) => {
        const status = info.getValue();
        return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
      },
    },
    {
      header: "Date & Time",
      accessorKey: "createdAt",
      cell: (info: any) =>
        new Date(info.getValue()).toLocaleDateString("en-IN"),
    },
  ];

  const searchEarnings = (earning: Earning, searchTerm: string) => {
    const term = searchTerm.toLowerCase();
    return (
      earning.orderData?.title?.toLowerCase().includes(term) ||
      earning.earningAmount.toString().includes(term)
    );
  };

  if (loading) return <Preloader />;

  return (
    <>
      <PageMeta title="Earning List" description="List of earnings" />
      <PageBreadcrumb pageTitle="Earning List" />
      <div className="space-y-6">
        <ComponentCard
          title="Earning List"
          rightSideContent={
            <span className="text-base font-medium text-gray-800 dark:text-white/90">
              Total Amount: ₹{totalAmount.toLocaleString()}
            </span>
          }
        >
          <AdvancedTable
            type="earning"
            data={earnings}
            columns={columns}
            loading={loading}
            pagination={pagination}
            onPageChange={(page) => setCurrentPage(page)}
            onRowsPerPageChange={(limit) => {
              setRowsPerPage(limit);
              setCurrentPage(1);
            }}
            searchFunction={searchEarnings}
            exportRow={exportRow}
          />
        </ComponentCard>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}
