// Updated OrderList.tsx
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import AdvancedTable from "../../components/tables/AdvancedTables/AdvancedTable";
import Preloader from "../../components/common/Preloader";
import { ToastContainer, toast } from 'react-toastify';
import { FetchData } from "../../utils/FetchData";
import { Pagination } from "../../Types/Pagination";
import { Order, OrderResponse } from "../../Types/Order";
import { getStatusText } from "../../components/common/Function";


export default function OrderList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const navigate = useNavigate();

  const fetchOrders = async (page: number, limit: number) => {
    setLoading(true);
    try {
      const result = await FetchData<OrderResponse>('/order/getAdminAllOrder', 'POST', {
        page,
        limit,
        status: selectedStatus !== null ? parseInt(selectedStatus) : null,
      });

      if (result.status && result?.data?.orderList) {
        setOrders(result.data.orderList);
        setPagination({
          total: result.data.pagination?.total || 0,
          currentPage: result.data.pagination?.page || 1,
          limit: result.data.pagination?.limit || 10,
          totalPages: result.data.pagination?.totalPages || 1,
        });
      } else {
        toast.error(result.message || "No orders found");
        setOrders([]);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Error fetching orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(currentPage, rowsPerPage);
  }, [currentPage, rowsPerPage, selectedStatus]);

  const handleView = (order: Order) => {
    navigate(`/order/view?id=${order.id}`);
  };

        const exportRow = (item: Order) => ({
          "Order Name": item.title || "N/A", 
          "Order Description": item.description || "N/A", 
          "Amount": item.totalAmount ? `₹${item.totalAmount}` : "N/A",
          "Type": item.type === "group" ? "Group" : "Influencer",
          "Status": getStatusText(item.status),
          "Created At": item.createdAt && !isNaN(new Date(item.createdAt).getTime())
            ? new Date(item.createdAt).toLocaleDateString("en-IN")
            : "N/A",
        });


  const columns = [
    { header: 'Order Name', accessorKey: 'title' },
    {
      header: 'Type',
      accessorKey: 'type',
      cell: (info: any) =>
        info?.row?.original?.groupOrderData === null ? "Influencer" : "Group",
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (info: any) =>
        getStatusText(info?.row?.original?.status) || "N/A",
    },
    {
      header: 'Amount',
      accessorKey: 'totalAmount',
    },
    {
      header: 'Delivery Date',
      accessorKey: 'completionDate',
      cell: (info: any) => new Date(info.getValue()).toLocaleDateString(),
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
        <div className="flex justify-left gap-2">
          <button
            onClick={() => handleView(info.row.original)}
            className="text-blue-500 hover:text-blue-700 bg-blue-100 hover:bg-blue-200 p-2 rounded-lg dark:bg-blue-900/20 dark:hover:bg-blue-900/30"
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
        </div>
      ),
    },
  ];

  const rightSideContent = (
    <select
      onChange={(e) =>
        setSelectedStatus(e.target.value !== "" ? e.target.value : null)
      }
      value={selectedStatus ?? ""}
      className="border p-2 rounded"
    >
      <option value="">Select Status</option>
      <option value="0">Pending</option>
      <option value="1">Accepted</option>
      <option value="2">Canceled</option>
      <option value="3">Activated</option>
      <option value="4">Order Submitted</option>
      <option value="5">Completed</option>
      <option value="6">Declined</option>
    </select>
  );

  if (loading) return <Preloader />;

  // const addButton = null;

  return (
    <>
      <PageMeta title="Orders" description="All order listings" />
      <PageBreadcrumb pageTitle="Orders" />
      <div className="space-y-6">
        <ComponentCard title="Order List">
          <AdvancedTable
          data={orders}
          columns={columns}
          loading={loading}
          pagination={pagination}
          onPageChange={setCurrentPage}
          onRowsPerPageChange={(limit) => {
            setRowsPerPage(limit);
            setCurrentPage(1);
          }}
          rightSideContent={rightSideContent}
          exportRow={exportRow}
          type="order"
        />

        </ComponentCard>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}
