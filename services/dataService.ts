import { Product, ProductListResponse } from '../types/product';
import parentProducts from '../assets/data/parent_products.json';

const transformProduct = (rawProduct: any): Product => {
  return {
    id: rawProduct._id.$oid || rawProduct._id,
    name: rawProduct.names?.en || 'Unnamed Product',
    brand: rawProduct.vendor?.name || 'Unknown Brand',
    price: rawProduct.price || 0,
    sku: rawProduct.sku || '',
    series: rawProduct.series?.name,
    mainImage: rawProduct.main_image || '',
    images: rawProduct.images || [],
    details: rawProduct.description_details?.en?.fabric || '',
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
        // Handle both object ID format and string ID format
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