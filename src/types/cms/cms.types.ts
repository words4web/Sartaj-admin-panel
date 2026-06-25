import { ITranslationMap } from "../api.types";

export interface ICMS {
  _id: string;
  slug: string;
  title: ITranslationMap;
  content: ITranslationMap;
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
  title: ITranslationMap;
  content: ITranslationMap;
}

export interface UpdateCMSPayload {
  slug?: string;
  title?: ITranslationMap;
  content?: ITranslationMap;
}

export interface CMSFilters {
  search?: string;
  page?: number;
  limit?: number;
}

export interface CmsFormValues {
  title: ITranslationMap;
  slug: string;
  content: ITranslationMap;
}

export interface CmsFormProps {
  initialValues: CmsFormValues;
  isSubmitting?: boolean;
  submitLabel?: string;
  onSubmit: (values: CmsFormValues) => Promise<void>;
}
