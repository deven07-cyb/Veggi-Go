// Types/AbuseReport.ts

export interface User {
  id: string;
  name: string;
  emailAddress: string;
}

export interface GroupAdminUser {
  id: string;
  name: string;
  emailAddress: string;
}

export interface AcceptedInvitedUser {
  id: string;
  name: string;
  emailAddress: string;
}

export interface AbuseReportedGroupData {
  id: string;
  groupName: string;
  adminUser: GroupAdminUser;
  acceptedInvitedUsers: AcceptedInvitedUser[];
}

export interface AbuseReportedUserData {
  id: string;
  name: string;
  emailAddress: string;
}

export interface AbuseReport {
  id: string;
  reportedBy: string;
  reportedUserId: string | null;
  reportedGroupId: string | null;
  status: 'GROUP' | 'BUSINESS' | 'INFLUENCER';
  createdAt: string;
  updatedAt: string;
  abuseReportedByData: User | null;
  abuseReportedUserData: AbuseReportedUserData | null;
  abuseReportedGroupData: AbuseReportedGroupData | null;
}

export interface AbuseReportPaginationData {
  status: boolean;
  message?: string;
  data: AbuseReportResponse;
}

export interface AbuseReportResponse {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  reports: AbuseReport[];
}