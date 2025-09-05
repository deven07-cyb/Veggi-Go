'use client';
import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import DeleteFile from "@/components/elements/DeleteFile";
import LayoutAdmin from "@/components/layout/LayoutAdmin";
import Preloader from "@/components/elements/Preloader";
import CommonTable from "@/components/common/CommonTable";
import { navigateTo } from "@/components/common/functions";

// Constants
const INITIAL_STATE = {
  properties: [
    {
      id: 1,
      full_name: "John Doe",
      email_address: "john@example.com",
      mobile_number: "9876543210",
      created_at: new Date().toISOString(),
      slug: "john-agency",
      image: ""
    },
    {
      id: 2,
      full_name: "Jane Smith",
      email_address: "jane@example.com",
      mobile_number: "9123456780",
      created_at: new Date().toISOString(),
      slug: "jane-agency",
      image: ""
    },
    {
      id: 3,
      full_name: "Michael Johnson",
      email_address: "michael@example.com",
      mobile_number: "9988776655",
      created_at: new Date().toISOString(),
      slug: "michael-agency",
      image: ""
    },
    {
      id: 4,
      full_name: "Emily Davis",
      email_address: "emily@example.com",
      mobile_number: "9090909090",
      created_at: new Date().toISOString(),
      slug: "emily-agency",
      image: ""
    },
    {
      id: 5,
      full_name: "David Wilson",
      email_address: "david@example.com",
      mobile_number: "8001234567",
      created_at: new Date().toISOString(),
      slug: "david-agency",
      image: ""
    },
  ],
  loading: false,
  error: null,
  searchTerm: '',
  currentPage: 1,
  startDate: '',
  endDate: ''
};

const PAGINATION_INITIAL = {
  totalCount: 5,
  totalPages: 1,
  currentPage: 1,
  itemsPerPage: 10
};

export default function AgencyListing() {
  const [state] = useState(INITIAL_STATE);
  const [pagination] = useState(PAGINATION_INITIAL);
  const router = useRouter();

  // Table columns
  const columns = useMemo(() => [
    {
      key: 'image',
      header: 'Image',
      type: 'custom',
      render: (item) => (
        <div className="image-cell-container">
          <div className="img-wrapper-sec">
            {item?.image ? (
              <img src={item.image} alt="Avatar" className="img-wrapper-sec" loading="lazy" />
            ) : (
              <div className="avatar-placeholder">
                <svg className="avatar-icon" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 
                          1.79-4 4 1.79 4 4 4zm0 2c-2.67 
                          0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
            )}
          </div>
        </div>
      )
    },
    { key: 'full_name', header: 'Full Name', type: 'custom', render: (item) => item?.full_name || 'N/A' },
    { key: 'email_address', header: 'Email Address', type: 'custom', render: (item) => item?.email_address || 'N/A' },
    { key: 'mobile_number', header: 'Mobile Number', type: 'custom', render: (item) => item?.mobile_number || 'N/A' },
    {
      key: 'created_at',
      header: 'Create Date',
      type: 'custom',
      render: (item) =>
        item?.created_at
          ? new Date(item.created_at).toLocaleString('en-US', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: false
            })
          : 'N/A'
    },
    { key: 'reset_password', header: 'Reset Password', type: 'reset_password' },
    { key: 'actions', header: 'Actions', type: 'actions' },
  ], []);

  if (state.loading) return <Preloader />;

  return (
    <>
      <DeleteFile />
      <LayoutAdmin>
        <div className="wrap-dashboard-content">
          <CommonTable
            title="Agency Listing"
            data={state.properties}
            loading={state.loading}
            columns={columns}
            pagination={pagination}
            onPageChange={() => {}}
            emptyMessage="No Data found"

            /** Search */
            searchable={true}
            onSearch={() => {}}
            onSearchValue={state.searchTerm}

            /* Date Filter */
            filterable={true}
            onFilter={false}
            onDateFilter={() => {}}

            onReset={() => {}}

            /* Add Edit Delete */
            onEdit={(data) => navigateTo(router, `/edit-agency/${data.id}`)}
            onView={(data) => window.open(`/agency/${data.slug}`, '_blank')}
            onDelete={() => {}}

            /* Add Agency */
            addButtonText="Add Agency"
            addButtonLink="/create-agency"
            SubText=""

            /* Export */
            exportable={false}
          />
        </div>
      </LayoutAdmin>
    </>
  );
}
