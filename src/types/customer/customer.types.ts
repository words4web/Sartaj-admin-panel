// Customer Types
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  status: "active" | "inactive" | "suspended";
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export interface CreateCustomerPayload {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  notes?: string;
}

export interface UpdateCustomerPayload extends Partial<CreateCustomerPayload> {
  status?: "active" | "inactive" | "suspended";
}

export interface CustomerListResponse {
  data: Customer[];
  total: number;
  page: number;
  limit: number;
}

export interface CustomerFilters {
  search?: string;
  status?: "active" | "inactive" | "suspended";
  sortBy?: "name" | "createdAt" | "email";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}
