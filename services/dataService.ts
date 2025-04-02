import { Product, ProductListResponse } from '../types/product';
import parentProducts from '../assets/data/parent_products.json';

const transformProduct = (rawProduct: any): Product => {
  return {
    id: rawProduct._id.$oid || rawProduct._id,
    vendorName: rawProduct.vendor?.name || 'Unknown Vendor',
    seriesName: rawProduct.series?.name || '',
    seriesItemQuantity: rawProduct.series?.item_quantity || 0,
    descriptionDetails: {
      fabric: rawProduct.description_details?.en?.fabric || '',
      modelMeasurements: rawProduct.description_details?.en?.model_measurements || '',
      sampleSize: rawProduct.description_details?.en?.sample_size || '',
      productMeasurements: rawProduct.description_details?.en?.product_measurements || '',
    },
    mainImage: rawProduct.main_image || '',
    price: rawProduct.price || 0,
    name: rawProduct.names?.en || 'Unnamed Product',
    images: rawProduct.images || [],
    productCode: rawProduct.product_code || '',
  };
};

export const dataService = {
  getProducts(): ProductListResponse {
    try {
      const products = parentProducts.map(transformProduct);
      return {
        products,
        total: products.length,
      };
    } catch (error) {
      console.error('Error processing product data:', error);
      return {
        products: [],
        total: 0,
      };
    }
  },

  getProductById(id: string): Product | null {
    try {
      const rawProduct = parentProducts.find((p) => {
        const productId = typeof p._id === 'object' && p._id.$oid 
          ? p._id.$oid 
          : p._id;
        return productId === id;
      });
      
      if (!rawProduct) {
        return null;
      }
      
      return transformProduct(rawProduct);
    } catch (error) {
      console.error('Error getting product by ID:', error);
      return null;
    }
  },
}; 