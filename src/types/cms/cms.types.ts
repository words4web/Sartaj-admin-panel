export interface ICMS {
  _id: string;
  slug: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface CMSListResponse {
  data: ICMS[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateCMSPayload {
  slug: string;
  title: string;
  content: string;
}

export interface UpdateCMSPayload {
  slug?: string;
  title?: string;
  content?: string;
}

export interface CMSFilters {
  search?: string;
  page?: number;
  limit?: number;
}
