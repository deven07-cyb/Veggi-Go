import React from 'react';

export type TableType =
  | 'earning'
  | 'app-settings'
  | 'brand'
  | 'category'
  | 'subcategory'
  | 'country'
  | 'state'
  | 'city'
  | 'order'
  | 'contact'
  | 'business'
  | 'influencer';

export interface TableColumn<T> {
  header: string;
  accessorKey: string;
  cell?: (info: { getValue: () => any; row: { original: T } }) => React.ReactNode;
}

export interface PaginationProps {
  total: number;
  currentPage: number;
  limit: number;
  totalPages: number;
}

export interface AddButtonProps {
  label: string;
  slug: string;
}

export interface AdvancedTableProps<T> {
  type?: TableType;
  addButton?: AddButtonProps | null;
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  pagination?: PaginationProps | null;
  onPageChange?: (page: number) => void;
  onRowsPerPageChange?: (limit: number) => void;
  searchFunction?: (item: T, searchTerm: string) => boolean;
  onSearch?: (search: string) => void;
  leftSideContent?: React.ReactNode;
  rightSideContent?: React.ReactNode;
  exportRow?: (item: T) => Record<string, string | number>;
  previousButton?: { label: string; slug: string } | null;
  // addButton?: { label: string; slug: string } | null;
  nextButton?: { label: string; slug: string } | null;
   enableSearch?: boolean;
}