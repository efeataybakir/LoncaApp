export interface Product {
  id: string;
  vendorName: string;
  seriesName: string;
  seriesItemQuantity: number;
  descriptionDetails: {
    fabric: string;
    modelMeasurements: string;
    sampleSize: string;
    productMeasurements: string;
  };
  mainImage: string;
  price: number;
  name: string;
  images: string[];
  productCode: string;
}

export interface ProductListResponse {
  products: Product[];
  total: number;
} 