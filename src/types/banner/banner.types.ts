import { ITranslationMap } from "../api.types";

export interface IBanner {
  _id: string;
  title: ITranslationMap;
  image: string;
  link?: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBannerPayload {
  title: ITranslationMap;
  image: File | null;
  link?: string;
  isActive?: boolean;
}

export interface UpdateBannerPayload extends Partial<CreateBannerPayload> {
  existingImage?: string;
}

export interface BannerListResponse {
  banners: IBanner[];
  total: number;
  page: number;
  limit: number;
}

export interface BannerFilters {
  search?: string;
  page?: number;
  limit?: number;
}

export type BannerFormValues = {
  title: ITranslationMap;
  link?: string;
  image?: File | null;
  existingImage?: string | null;
  isActive: boolean;
};

export type BannerFormProps = {
  initialValues: BannerFormValues;
  isSubmitting?: boolean;
  submitLabel?: string;
  onSubmit: (values: BannerFormValues) => void | Promise<void>;
};
