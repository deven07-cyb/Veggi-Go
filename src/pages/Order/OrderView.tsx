import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Preloader from "../../components/common/Preloader";
import { ToastContainer, toast } from "react-toastify";
import { FetchData } from "../../utils/FetchData";
import Button from '../../components/ui/button/Button';
import { getStatusText } from "../../components/common/Function";

const OrderView = () => {
  const [order, setOrder] = useState<any>(null);
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const orderId = queryParams.get("id");

  useEffect(() => {
    const fetchOrderData = async () => {
      if (!orderId) {
        toast.error("No order ID provided.");
        navigate("/order");
        return;
      }

      try {
        setLoading(true);

        // Fetch basic order details
        const [orderResult, orderDataResult] = await Promise.all([
          FetchData("/order/getById", "POST", { id: orderId }),
          FetchData("/order/getDataByOrderId", "POST", { id: orderId })
        ]);

        // Handle basic order data
        if (orderResult.status && orderResult.data) {
          setOrder(orderResult.data);
        } else {
          toast.error(orderResult.message || "Order not found");
        }

        // Handle detailed order data
        if (orderDataResult.status && orderDataResult.data) {
          setOrderData(orderDataResult.data);
        } else {
          toast.error(orderDataResult.message || "Order details not found");
        }

      } catch (error) {
        console.error("Error fetching order data:", error);
        toast.error("Error fetching order information");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
  }, [orderId, navigate]);

  if (loading) return <Preloader />;
  if (!order && !orderData) return null;

  const calculatedTotal = (
    orderData.summary.breakup?.reduce((acc: number, item: any) => acc + parseFloat(item.amount), 0) +
    parseFloat(orderData.summary.adminOtherAmount)
  ).toFixed(2);
  const finalAmount = parseFloat(order?.finalAmount).toFixed(2);

  return (
    <>
      <PageMeta title="Order View" description="Order detail page" />
      <PageBreadcrumb pageTitle="Order Detail" />

      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex items-center justify-between px-6 py-5">
            <h3 className="text-base font-medium text-gray-800 dark:text-white/90">Order Detail</h3>
            <Button size="sm" variant="primary" onClick={() => navigate("/order")}>
              Back to Orders
            </Button>
          </div>

          <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Order Name:</strong> {order?.title ?? "N/A"}
                </div>
                <div>
                  <strong>Amount:</strong> ₹{order?.totalAmount ?? "N/A"}
                </div>
                <div>
                  <strong>Order Description:</strong> {order?.description ?? "N/A"}
                </div>
                <div>
                  <strong>Discount Amount:</strong> ₹{order?.discountAmount ?? "N/A"}
                </div>
                <div>
                  <strong>Status:</strong> {getStatusText(order?.status)}
                </div>
                <div>
                  <strong>Final Amount:</strong> ₹{order?.finalAmount ?? "N/A"}
                </div>
                <div>
                  <strong>Payment Status:</strong> {order?.paymentStatus ?? "N/A"}
                </div>
                <div>
                  <strong>Delivery Date:</strong> {order?.completionDate ? new Date(order.completionDate).toLocaleString() : "N/A"}
                </div>
                <div>
                  <strong>Created At:</strong> {order?.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Side-by-side layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Business Detail */}
          <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="flex items-center justify-between px-6 py-5">
              <h3 className="text-base font-medium text-gray-800 dark:text-white/90">Business Detail</h3>
            </div>
            <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4 text-sm">
                  <div>
                    <strong>Business Name:</strong> {order?.businessOrderData?.name ?? "N/A"}
                  </div>
                  <div>
                    <strong>Business Email:</strong> {order?.businessOrderData?.emailAddress ?? "N/A"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Influencer / Group Detail */}
          <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="flex items-center justify-between px-6 py-5">
              <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
                {order?.groupOrderData === null ? "Influencer" : "Group"} Detail
              </h3>
            </div>
            <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4 text-sm">
                  {order?.influencerOrderData && (
                    <div>
                      <strong>Influencer Name:</strong> {order?.influencerOrderData?.name ?? "N/A"}
                    </div>

                  )}
                  {order?.groupOrderData && (
                    <>
                      <div>
                        <strong>Group Name:</strong> {order?.groupOrderData?.groupName ?? "N/A"}
                      </div>
                      <div>
                        <strong>Admin User Name:</strong> {order?.groupOrderData?.groupData?.adminUser?.name ?? "N/A"}
                      </div>
                      {order?.groupOrderData?.groupData?.invitedUsers.map((invitedUserData: any, index: number) => (
                        <div key={`name-${index}`}>
                          <strong>Invited User Name:</strong> {invitedUserData.name ?? "N/A"}
                        </div>
                      ))}
                      {order?.groupOrderData?.groupData?.invitedUsers.map((invitedUserData: any, index: number) => (
                        <div key={`email-${index}`}>
                          <strong>Invited User Email Address:</strong> {invitedUserData.emailAddress ?? "N/A"}
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tax Details Section */}
      {orderData && (
        <div className="mt-6 rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex items-center justify-between px-6 py-5">
            <h3 className="text-base font-medium text-gray-800 dark:text-white/90">Order Tax Details</h3>
          </div>
          <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
            <div className="space-y-6">
              {/* Basic Tax Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Order Id:</strong> {order?.orderId ?? order?.id ?? "N/A"}
                </div>
                <div>
                  <strong>Invoice Id:</strong> {orderData?.invoiceId ?? "N/A"}
                </div>
                <div>
                  <strong>Amount:</strong> ₹{order?.totalAmount ?? "N/A"}
                </div>
                <div>
                  <strong>Final Amount:</strong> ₹{order?.finalAmount ?? "N/A"} (Amount + GST)
                </div>
              </div>

              {/* GST Details Table */}
              {orderData?.gstDetails && orderData.gstDetails.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-800 dark:text-white/90 mb-3">GST Details</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-200 dark:border-gray-700">
                      <thead>
                        <tr className="bg-gray-50 dark:bg-gray-800">
                          <th className="border border-gray-200 dark:border-gray-700 px-3 py-2 text-left text-xs font-medium text-gray-700 dark:text-gray-300">Name</th>
                          <th className="border border-gray-200 dark:border-gray-700 px-3 py-2 text-left text-xs font-medium text-gray-700 dark:text-gray-300">Type</th>
                          <th className="border border-gray-200 dark:border-gray-700 px-3 py-2 text-left text-xs font-medium text-gray-700 dark:text-gray-300">Email</th>
                          <th className="border border-gray-200 dark:border-gray-700 px-3 py-2 text-left text-xs font-medium text-gray-700 dark:text-gray-300">GST Number</th>
                          <th className="border border-gray-200 dark:border-gray-700 px-3 py-2 text-right text-xs font-medium text-gray-700 dark:text-gray-300">Basic Amount</th>
                          <th className="border border-gray-200 dark:border-gray-700 px-3 py-2 text-right text-xs font-medium text-gray-700 dark:text-gray-300">GST</th>
                          <th className="border border-gray-200 dark:border-gray-700 px-3 py-2 text-right text-xs font-medium text-gray-700 dark:text-gray-300">TDS</th>
                          <th className="border border-gray-200 dark:border-gray-700 px-3 py-2 text-right text-xs font-medium text-gray-700 dark:text-gray-300">TCS</th>
                          <th className="border border-gray-200 dark:border-gray-700 px-3 py-2 text-right text-xs font-medium text-gray-700 dark:text-gray-300">Other Amount</th>
                          <th className="border border-gray-200 dark:border-gray-700 px-3 py-2 text-right text-xs font-medium text-gray-700 dark:text-gray-300">Total Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orderData.gstDetails.map((gstDetail: any, index: number) => (
                          <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                            <td className="border border-gray-200 dark:border-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100">
                              {gstDetail.name}
                            </td>
                            <td className="border border-gray-200 dark:border-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100">
                              <span className={`px-2 py-1 text-xs rounded-full ${gstDetail.type === 'ADMIN'
                                ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                                : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                }`}>
                                {gstDetail.type}
                              </span>
                            </td>
                            <td className="border border-gray-200 dark:border-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100">
                              {gstDetail.emailAddress}
                            </td>
                            <td className="border border-gray-200 dark:border-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100">
                              {gstDetail.gstNumber || "N/A"}
                            </td>
                            <td className="border border-gray-200 dark:border-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 text-right">
                              ₹{Number(gstDetail.basicAmount).toFixed(2)}
                            </td>
                            <td className="border border-gray-200 dark:border-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 text-right">
                              ₹{Number(gstDetail.gst).toFixed(2)}
                            </td>
                            <td className="border border-gray-200 dark:border-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 text-right">
                              ₹{Number(gstDetail.tds).toFixed(2)}
                            </td>
                            <td className="border border-gray-200 dark:border-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 text-right">
                              ₹{Number(gstDetail.tcs).toFixed(2)}
                            </td>
                            <td className="border border-gray-200 dark:border-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 text-right">
                              ₹{Number(gstDetail.otherAmount).toFixed(2)}
                            </td>
                            <td className="border border-gray-200 dark:border-gray-700 px-3 py-2 text-sm font-medium text-gray-900 dark:text-gray-100 text-right">
                              ₹{Number(gstDetail.totalAmt).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Summary Section */}
              {orderData?.summary && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Amount Breakup */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-800 dark:text-white/90 mb-3">Amount Breakup</h4>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                      <div className="space-y-2">
                        {orderData.summary.breakup?.map((item: any, index: number) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span className="text-gray-700 dark:text-gray-300">
                              {item.type === "ADMIN" ? "Admin  (PLATFORM)" : `${item.name}`}
                            </span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                              ₹{item.amount}
                            </span>
                          </div>
                        ))}

                        <div className="flex justify-between text-sm">
                          <span className="text-gray-700 dark:text-gray-300">Admin Other Amount</span>
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            ₹{orderData.summary.adminOtherAmount}
                          </span>
                        </div>

                        {/* Extra Charges (if any) */}
                        {Number(finalAmount) !== calculatedTotal && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-700 dark:text-gray-300">Extra Charges</span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                              ₹{(Number(finalAmount) - calculatedTotal).toFixed(2)}
                            </span>
                          </div>
                        )}

                        <div className="flex justify-between text-sm font-bold border-t border-gray-200 dark:border-gray-700 pt-2">
                          <span className="text-gray-900 dark:text-gray-100">Grand Total</span>
                          <span className="text-lg text-gray-900 dark:text-gray-100">
                            ₹{finalAmount}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>


                  {/* Summary Totals */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-800 dark:text-white/90 mb-3">Summary Totals</h4>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-700 dark:text-gray-300">Total TDS</span>
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            ₹{orderData.summary.totalTDS}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-700 dark:text-gray-300">Total TCS</span>
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            ₹{orderData.summary.totalTCS}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default OrderView;
