import { IProduct } from "../product/product.types";

export interface IBundle {
  _id: string;
  title: string;
  productIds: string[] | IProduct[];
  discountValue: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBundlePayload {
  title: string;
  productIds: string[];
  discountValue: number;
}

export interface BundleFormProps {
  initialData?: IBundle;
  isSubmitting: boolean;
  onSubmit: (values: CreateBundlePayload) => void;
}
