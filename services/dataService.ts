import { Product, ProductListResponse, ProductColor } from '../types/product';
import parentProducts from '../assets/data/parent_products.json';

const extractColorFromName = (name: string): string => {
  const parts = name.split('-');
  return parts.length > 2 ? parts[parts.length - 1].trim() : '';
};

const transformProduct = (rawProduct: any): Product => {
  const name = rawProduct.names?.en || 'Unnamed Product';
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
    name: name,
    color: extractColorFromName(name),
    productCode: rawProduct.product_code || '',
    images: rawProduct.images || [],
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

  getProductColors(productCode: string): ProductColor[] {
    try {
      const baseCode = productCode.split('-')[0];
      const products = this.getProducts().products;
      const relatedProducts = products.filter(
        (p) => p.productCode.startsWith(baseCode)
      );

      return relatedProducts.map((p) => ({
        name: p.color || '',
        productId: p.id,
        mainImage: p.mainImage,
      }));
    } catch (error) {
      console.error('Error getting product colors:', error);
      return [];
    }
  },

  getRelatedProducts(productCode: string, currentId: string): Product[] {
    try {
      return parentProducts
        .filter(p => p.product_code === productCode && (p._id.$oid || p._id) !== currentId)
        .map(transformProduct);
    } catch (error) {
      console.error('Error getting related products:', error);
      return [];
    }
  }
}; 