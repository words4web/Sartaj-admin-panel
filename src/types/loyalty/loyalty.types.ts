export interface LoyaltyCustomerInfo {
  _id: string;
  fullName: string;
  email?: string;
  mobileNumber?: string;
}

export interface LoyaltyMember {
  _id: string;
  customer?: LoyaltyCustomerInfo;
  isActive: boolean;
  qualifiedAt?: string | null;
  cumulativeSpend: number;
  freeDeliveriesRemaining: number;
  freeDeliveriesResetYear: number;
  lastBirthdayDiscountYear?: number | null;
  welcomeEmailSent?: boolean;
  hamperSent?: boolean;
  hamperSentAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LoyaltyMembersQueryParams {
  page?: number;
  limit?: number;
}

export interface LoyaltyMembersListResponse {
  members: LoyaltyMember[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
