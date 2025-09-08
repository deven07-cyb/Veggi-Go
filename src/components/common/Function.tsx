export const getImageName = (url: string) => {
    return new URL(url).pathname.split('/').pop();
};


export const getStatusText = (status: any): string => {

    const statusMap: Record<string | number, string> = {
        0: "Pending",
        1: "Accepted",
        2: "Canceled",
        3: "Activated",
        4: "Order Submitted",
        5: "Completed",
        6: "Declined",
        PENDING: "Pending",
        ACCEPTED: "Accepted",
        CANCELED: "Canceled",
        ACTIVATED: "Activated",
        ORDERSUBMITTED: "Order Submitted",
        COMPLETED: "Completed",
        DECLINED: "Declined",
    };

    if (status === undefined || status === null) return "Not Available";
    const key = typeof status === "string" ? status.toUpperCase() : status;
    return statusMap[key] || status;
};