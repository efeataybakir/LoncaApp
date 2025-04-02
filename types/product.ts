export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  sku: string;
  series?: string;
  mainImage: string;
  images: string[];
  details?: string;
}

export interface ProductListResponse {
  products: Product[];
  total: number;
} 