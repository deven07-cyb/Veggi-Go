import React, { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight, Edit, Eye, Trash2, Plus, Filter, Calendar, Download, FileText, FileSpreadsheet, LockKeyhole, KeyRound, X } from 'lucide-react';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import Preloader from '../elements/Preloader';
import { navigateTo, getUserRolePermission } from '@/components/common/functions';
import Link from "next/link";
import { useRouter } from 'next/navigation';
const CommonTable = ({
  title = "Table",
  SubText = "",
  data = [],
  columns = [],
  loading = false,
  searchable = false,
  filterable = false,
  dateFilterable = false,
  visitScheduleList = [],
  exportable = false,
  exportFormats = ['pdf', 'excel'], // ['pdf', 'excel'] or subset
  pagination = { currentPage: 1, totalPages: 1, totalCount: 0, itemsPerPage: 1 },
  onSearch = () => { },
  onFilter = () => { },
  onDateFilter = () => { },
  onExport = () => { },
  onPageChange = () => { },
  onReset = () => { },
  onEdit = () => { },
  onView = () => { },
  onDelete = () => { },
  onSearchValue = null,
  addButtonText = "Add Item",
  addButtonLink = "#",
  filterOptions = [],
  customTitle = null,
  emptyMessage = "No data available",
  onSort = () => { },
  sortConfig = {},

}) => {
  const [searchTerm, setSearchTerm] = useState(onSearchValue || '');
  const [selectedFilter, setSelectedFilter] = useState('');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  // const [dateRange, setDateRange] = useState({
  //   startDate: localStorage.getItem('startDate') ||'',
  //   endDate:  localStorage.getItem('endDate') || ''
  // });
  const [dateRange, setDateRange] = useState(() => ({
    startDate: typeof window !== "undefined" ? localStorage.getItem("startDate") || "" : "",
    endDate: typeof window !== "undefined" ? localStorage.getItem("endDate") || "" : ""
  }));

  // Delete confirmation modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  //const [sortConfig, setSortConfig] = useState(null);
  const [sortingData, setSortedData] = useState(null);

  const router = useRouter();

  // Debug logging
  useEffect(() => {

  }, [data, loading, pagination, searchTerm]);

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  // Handle search on Enter key
  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleFilterSelect = (filterValue) => {
    setSelectedFilter(filterValue);
    onFilter(filterValue);
    setShowFilterDropdown(false);
  };

  const handleDateFilter = () => {
    onDateFilter(dateRange);
    setShowDateFilter(false);
  };

  const handleDateRangeReset = () => {
    setDateRange({ startDate: '', endDate: '' });
    onDateFilter({ startDate: '', endDate: '' });
  };

  const handleExport = (format) => {
    onExport(format, data, columns);
    setShowExportDropdown(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Invalid Date';
    }
  };

  // Modified handleDeleteClick to show confirmation modal
  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  // Handle the actual delete operation after confirmation
  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    setIsDeleting(true);
    try {
      const result = await onDelete(itemToDelete);
      if (result) {
        setShowDeleteModal(false);
        setItemToDelete(null);
      }
    } catch (error) {
      console.error('Delete operation failed:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle cancel delete
  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setItemToDelete(null);
    setIsDeleting(false);
  };


  const handleSort = (key) => {
    /*let direction = 'asc';
    
    // If already sorting this column, toggle direction
    if (sortConfig?.key === key) {
      direction = sortConfig.direction === 'asc' ? 'desc' : 'asc';
    }
    
    // Call parent component's sort handler
    if (onSort) {
      onSort(key, direction);
    }
    
    // For client-side sorting if needed
    if (!onSort && Array.isArray(data)) {
      const sortedData = [...data].sort((a, b) => {
        if (typeof a[key] === 'string' && typeof b[key] === 'string') {
          return direction === 'asc' 
            ? a[key].localeCompare(b[key])
            : b[key].localeCompare(a[key]);
        }
        return direction === 'asc' ? a[key] - b[key] : b[key] - a[key];
      });
      setSortedData(sortedData);
    }*/
    let direction = 'asc';

    // Check if this column is already being sorted
    const existingSort = sortConfig.find(sc => sc.key === key);

    if (existingSort) {
      // Toggle direction if already sorting this column
      direction = existingSort.direction === 'asc' ? 'desc' : 'asc';
    }

    // Call parent component's sort handler
    if (onSort) {
      onSort(key, direction);
    }

    // For client-side sorting if needed
    if (!onSort && Array.isArray(data)) {
      const sortedData = [...data].sort((a, b) => {
        for (const config of sortConfig) {
          const compareResult = config.direction === 'asc'
            ? String(a[config.key]).localeCompare(String(b[config.key]))
            : String(b[config.key]).localeCompare(String(a[config.key]));
          if (compareResult !== 0) return compareResult;
        }
        return 0;
      });
      setSortedData(sortedData);
    }
  };
  const renderCellContent = (item, column) => {
    if (!item) return 'N/A';

    const value = item[column.key];

    // Handle custom render function
    if (column.type === 'custom' && column.render) {
      return column.render(item);
    }

    switch (column.type) {
      case 'image':
        return (
          <div className="image-cell-container">
            <div className="avatar-wrapper">
              {value ? (
                <img
                  src={value}
                  alt="Avatar"
                  className="avatar-image"
                  onError={(e) => {
                    console.error('Image load error:', e);
                    e.target.style.display = 'none';
                  }}
                />
              ) : (
                <div className="avatar-placeholder">
                  <svg className="avatar-icon" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
              )}
            </div>
          </div>
        );

      case 'status':
        const statusValue = value ? String(value).toLowerCase() : '';
        return (
          <span className={`status-badge ${statusValue
            ? 'status-active'
            : !statusValue
              ? 'status-inactive'
              : 'status-unknown'
            }`}>
            {(statusValue) ? 'Active' : 'Inactive'}
          </span>
        );

      case 'pictures':
        return (
          item.picture && item.picture.length > 0
            ? <img src={item.picture[0]} alt="image" style={{ width: "100px", height: "100px", objectFit: "cover" }} />
            : 'No Image'
        );

      case 'img':
        return (
          <img src={value} alt="image" style={{ width: "100px", height: "100px", objectFit: "cover" }} />
        );

      case 'date':
        return formatDate(value);

      case 'price_user_name':
        return (
          <>
            <span>{item.price}</span>
            <span> {item.currency}</span><br />
            <span>{item.user_name}</span>
          </>
        );

      case 'reset_password':
        return (
          <div className="d-flex justify-content-center align-items-center">
            <button
              onClick={() => onReset(item)}
              className="action-btn action-btn-reset"
              title="Reset Password"
            >
              <LockKeyhole size={20} />
              {/* <Lock size={16} />
              <RefreshCcw size={16} /> */}
            </button>
          </div>
        );

      case 'actions':
        return (
          <div className="action-buttons">
            {onView && (
              <button
                onClick={() => onView(item)}
                className="action-btn action-btn-view"
                title="View"
              >
                <Eye size={20} />
              </button>
            )}
            {(getUserRolePermission('write') && onEdit) && (
              <button
                onClick={() => onEdit(item)}
                className="action-btn action-btn-edit"
                title="Edit"
              >
                <Edit size={20} />
              </button>
            )}
            {(getUserRolePermission('write') && onDelete) && (
              <button
                onClick={() => handleDeleteClick(item)}
                className="action-btn action-btn-delete"
                title="Delete"
              >
                <Trash2 size={20} />
              </button>
            )}
          </div>
        );

      case 'delete':
        return (
          <div>
            <button
              onClick={() => handleDeleteClick(item)}
              className="action-btn action-btn-delete"
              title="Delete"
            >
              <Trash2 size={20} />
            </button>
          </div>
        );

      default:
        return value || 'N/A';
    }
  };

  const generatePaginationNumbers = () => {
    const { currentPage, totalPages } = pagination;
    const pages = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, 5);
      } else if (currentPage >= totalPages - 2) {
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pages.push(i);
        }
      }
    }

    return pages;
  };

  // Ensure data is an array
  const safeData = Array.isArray(data) ? data : [];

  // Check if any filters/controls are enabled
  const hasControls = searchable || filterable || dateFilterable || exportable;
  const handleClickLink = (slug) => {
    router.push(`/${slug}`);
  };

  const sortingHTML = (column, sortConfig) => {
    /*return (
      <span className="sort-indicator">
        {sortConfig?.key === column.key ? (
          sortConfig.direction === 'asc' ? (
            <ChevronUp size={16} className="active-sort" />
          ) : (
            <ChevronDown size={16} className="active-sort" />
          )
        ) : (
          <ChevronsUpDown size={16} className="inactive-sort" />
        )}
      </span>
    );*/
    const columnSort = Array.isArray(sortConfig)
      ? sortConfig.find(sc => sc.key === column.key)
      : sortConfig?.key === column.key ? sortConfig : null;

    return (
      <span className="sort-indicator">
        {columnSort ? (
          columnSort.direction === 'asc' ? (
            <ChevronUp size={16} className="active-sort" />
          ) : (
            <ChevronDown size={16} className="active-sort" />
          )
        ) : (
          <ChevronsUpDown size={16} className="inactive-sort" />
        )}
      </span>
    );
  };
  return (
    <div className="common-table-container">
      {/* Header */}
      <div className="table-header">
        <div className="header-flex">
          <h1 className="header-title">{title}</h1>
          <nav className="breadcrumb">
            <span>Home</span>
            <ChevronRight size={16} />
            <span className="breadcrumb-current">{title}</span>
          </nav>
        </div>
      </div>

      {/* Business List Header */}
      <div className="table-content">
        {/* <div className="business-header">
          {SubText && (<h2 className="business-title">{SubText}</h2>)}
          {(getUserRolePermission('write')) && addButtonLink && addButtonLink !== '#' && (
            <div className="add-button custom-link" onClick={() => navigateTo(router, addButtonLink)}>
              <Plus size={18} />
              <span>{addButtonText}</span>
            </div>
          )}
        </div> */}

        <div className="business-header">
          {SubText && <h2 className="business-title">{SubText}</h2>}

          {(getUserRolePermission("write")) && addButtonLink && addButtonLink !== "#" && (
            <div className="button-group flex gap-3" style={{ display: 'flex', gap: '10px' }}>
              {/* Add Button */}
              <div
                className="form-wg tf-btn primary  custom-link"
                onClick={() => navigateTo(router, addButtonLink)}
              >
                <Plus size={18} />
                <span>{addButtonText}</span>
              </div>

              {/* Back Button */}
              <button
                className="form-wg tf-btn primary"
                type="button"
                onClick={() => navigateTo(router, "/dashboard")}
              >
                <span style={{ color: "#fff" }}>&lt; Back</span>
              </button>
            </div>
          )}
        </div>

        {/* Search, Filter, Date Filter and Export Bar */}
        {hasControls && (
          <div className="search-filter-container">
            <div className="search-controls">
              {searchable && (
                <div className="search-group">
                  <div>
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyPress={handleSearchKeyPress}
                      className="search-input"
                    />
                  </div>
                  <button
                    onClick={handleSearch}
                    className="search-button"
                  >
                    <Search size={16} />
                    Search
                  </button>
                </div>
              )}

              {filterable && filterOptions.length > 0 && (
                <div className="filter-container">
                  <button
                    onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                    className="filter-button"
                  >
                    <Filter size={16} />
                    <span>Filter</span>
                  </button>

                  {showFilterDropdown && (
                    <div className="filter-dropdown">
                      <div>
                        {filterOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => handleFilterSelect(option.value)}
                            className="filter-dropdown-item"
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {dateFilterable && (
                <div className="date-filter-container">
                  <div className="visit-controls-container">
                    {visitScheduleList.length > 0 && visitScheduleList.map((visit, index) => (
                      <button
                        key={index}
                        onClick={() => handleClickLink(visit.link)}
                        className={`visit-btn ${visit.active ? 'visit-btn-active' : 'visit-btn-inactive'}`}
                      >
                        {visit.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="table-actions">
              {exportable && exportFormats.length > 0 && (
                <>
                  <div>
                    <button
                      onClick={() => setShowDateFilter(!showDateFilter)}
                      className="date-filter-button-enhanced"
                    >
                      <div className="button-icon-container">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2" />
                          <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2" />
                          <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2" />
                          <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2" />
                        </svg>
                      </div>
                      <span className="button-text">Date Filter</span>
                      <div className="button-arrow">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    </button>
                    {showDateFilter && (
                      <div className="date-filter-dropdown-enhanced">
                        <div className="date-filter-content">
                          <div className="date-input-group">
                            <label>From:</label>
                            <input
                              type="text"
                              placeholder="YYYY-MM-DD"
                              value={dateRange.startDate ? dateRange.startDate.slice(0, 10) : ''}
                              onChange={(e) =>
                                setDateRange((prev) => ({ ...prev, startDate: e.target.value }))
                              }
                              onFocus={(e) => {
                                e.target.type = 'date';
                                setTimeout(() => {
                                  if (typeof e.target.showPicker === 'function') {
                                    e.target.showPicker();
                                  }
                                }, 10);
                              }}
                              onBlur={(e) => {
                                setTimeout(() => {
                                  if (!e.target.value) {
                                    e.target.type = 'text';
                                  }
                                }, 100);
                              }}
                            />
                          </div>

                          <div className="date-input-group">
                            <label>To:</label>
                            <input
                              type="text"
                              placeholder="YYYY-MM-DD"
                              value={dateRange.endDate ? dateRange.endDate.slice(0, 10) : ''}
                              onChange={(e) =>
                                setDateRange((prev) => ({ ...prev, endDate: e.target.value }))
                              }
                              onFocus={(e) => {
                                e.target.type = 'date';
                                setTimeout(() => {
                                  if (typeof e.target.showPicker === 'function') {
                                    e.target.showPicker();
                                  }
                                }, 10);
                              }}
                              onBlur={(e) => {
                                setTimeout(() => {
                                  if (!e.target.value) {
                                    e.target.type = 'text';
                                  }
                                }, 100);
                              }}
                            />
                          </div>

                          <div className="date-filter-actions">
                            <button
                              onClick={handleDateFilter}
                              className="date-filter-apply-btn-enhanced"
                            >
                              Apply Filter
                            </button>
                            <button
                              onClick={
                                handleDateRangeReset
                              }
                              className="date-filter-reset-btn-enhanced"
                            >
                              Clear
                            </button>
                          </div>
                        </div>
                      </div>

                    )}
                  </div>
                  {(getUserRolePermission('export')) && (
                    <div className="export-container">
                      <button
                        onClick={() => setShowExportDropdown(!showExportDropdown)}
                        className="export-button-enhanced"
                      >
                        <div className="button-icon-container">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2" />
                            <polyline points="7,10 12,15 17,10" stroke="currentColor" strokeWidth="2" />
                            <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="2" />
                          </svg>
                        </div>
                        <span className="button-text">Export Data</span>
                        <div className="button-arrow">
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      </button>

                      {showExportDropdown && (
                        <div className="export-dropdown-enhanced">
                          <div className="dropdown-header">
                            <span>Choose Export Format</span>
                          </div>
                          <div className="dropdown-content">
                            {exportFormats.includes('pdf') && (
                              <button
                                onClick={() => handleExport('pdf')}
                                className="export-dropdown-item-enhanced pdf-export"
                              >
                                <div className="export-icon-container">
                                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" fill="#FF4444" />
                                    <text x="12" y="16" textAnchor="middle" fontSize="6" fill="white" fontWeight="bold">PDF</text>
                                  </svg>
                                </div>
                                <div className="export-text-container">
                                  <span className="export-title">Export as PDF</span>
                                  <span className="export-subtitle">Portable Document Format</span>
                                </div>
                              </button>
                            )}
                            {exportFormats.includes('excel') && (
                              <button
                                onClick={() => handleExport('excel')}
                                className="export-dropdown-item-enhanced excel-export"
                              >
                                <div className="export-icon-container">
                                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" fill="#1D6F42" />
                                    <rect x="7" y="11" width="10" height="1" fill="white" />
                                    <rect x="7" y="13" width="10" height="1" fill="white" />
                                    <rect x="7" y="15" width="10" height="1" fill="white" />
                                    <rect x="7" y="17" width="10" height="1" fill="white" />
                                  </svg>
                                </div>
                                <div className="export-text-container">
                                  <span className="export-title">Export as Excel</span>
                                  <span className="export-subtitle">Microsoft Excel Spreadsheet</span>
                                </div>
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* Table */}
        <div className="table-container">
          <table className="data-table">
            <thead className="table-header-row">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={`table-header-cell ${column.sortable ? 'sortable' : ''}`}
                    onClick={() => column.sortable && handleSort(column.key, column.direction)}
                  >
                    <div className="header-content">
                      {column.header}
                      {column.sortable && (
                        sortingHTML(column, sortConfig)
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="table-body">
              {loading ? (
                <tr>
                  <td colSpan={columns.length} className="loading-container">
                    <div className="loading-content">
                      <div className="loading-spinner"></div>
                    </div>
                  </td>
                </tr>
              ) : safeData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="empty-state">
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                safeData.map((item, index) => (
                  <tr key={item.id || index} className="table-row">
                    {columns.map((column) => (
                      <td key={column.key} className="table-cell">
                        {renderCellContent(item, column)}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="pagination-container">
            <div className="pagination-info">
              Showing {Math.min((pagination.currentPage - 1) * pagination.itemsPerPage + 1, pagination.totalCount)} to{' '}
              {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalCount)} of{' '}
              {pagination.totalCount} entries
            </div>

            <div className="pagination-controls">
              <button
                onClick={() => onPageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className="pagination-btn"
              >
                Previous
              </button>

              {generatePaginationNumbers().map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  className={`pagination-btn pagination-btn-page ${pageNum === pagination.currentPage ? 'active' : ''
                    }`}
                >
                  {pageNum}
                </button>
              ))}

              <button
                onClick={() => onPageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
                className="pagination-btn"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="table-delete-modal modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3 className="modal-title">Delete Record</h3>
              <button
                onClick={handleCancelDelete}
                className="modal-close-btn"
                disabled={isDeleting}
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <p className="modal-message">
                Are you sure you want to delete this user?
              </p>
            </div>

            <div className="modal-footer">
              <button
                onClick={handleCancelDelete}
                className="modal-btn modal-btn-cancel"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="modal-btn modal-btn-delete"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <div className="btn-spinner"></div>
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`

      .sortable {
        cursor: pointer;
        user-select: none;
      }

      .sortable:hover {
        background-color: #f5f5f5;
      }

      .sort-indicator {
        margin-left: 8px;
        display: inline-flex;
        vertical-align: middle;
      }

      .inactive-sort {
        opacity: 0.3;
        transition: opacity 0.2s;
      }

      .sortable:hover .inactive-sort {
        opacity: 0.8;
      }

      .active-sort {
        color: #045c8d;
      }

      .sort-indicator {
        display: flex;
        align-items: center;
      }

      .unsorted-icon {
        opacity: 0.3;
        transition: opacity 0.2s;
      }

      th:hover .unsorted-icon {
        opacity: 0.8;
      }
       .header-content {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .sort-indicator {
          display: inline-block;
          width: 16px;
          text-align: center;
        }
        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-container {
          background: white;
          border-radius: 12px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          max-width: 400px;
          width: 90%;
          max-height: 90vh;
          overflow: hidden;
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 24px;
          border-bottom: 1px solid #e5e7eb;
        }

        .modal-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: #111827;
          margin: 0;
        }

        .modal-close-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          color: #6b7280;
          border-radius: 4px;
          transition: all 0.2s;
        }

        .modal-close-btn:hover:not(:disabled) {
          background-color: #f3f4f6;
          color: #374151;
        }

        .modal-close-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .modal-body {
          padding: 20px 24px;
        }

        .modal-message {
          color: #6b7280;
          margin: 0;
          line-height: 1.5;
        }

        .modal-footer {
          display: flex;
          gap: 12px;
          padding: 20px 24px;
          justify-content: flex-end;
          border-top: none;
          background: none;
        }

        .modal-btn {
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
          display: flex;
          align-items: center;
          gap: 8px;
          min-width: 80px;
          justify-content: center;
        }

        .modal-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .modal-btn-cancel {
          background-color: #f3f4f6;
          color: #374151;
          border: 1px solid #d1d5db;
        }

        .modal-btn-cancel:hover:not(:disabled) {
          background-color: #e5e7eb;
        }

        .modal-btn-delete {
          background-color: #045c8d;
          color: white;
        }

        .modal-btn-delete:hover:not(:disabled) {
          background-color: #00a8c1;
        }

        .btn-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid transparent;
          border-top: 2px solid currentColor;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        table td {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 300px;
        }
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default CommonTable;