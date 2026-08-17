
export interface CreateProductData {
  name: string;
  description?: string;
  price: number;
  categoryId: number;
  userId: number;
}

export interface UpdateProductData {
  name?: string;
  description?: string;
  price?: number;
  categoryId?: number;
}

