import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Platform,
} from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { dataService } from '../../services/dataService';
import { Product } from '../../types/product';
import { ColorSelector } from '../../components/ColorSelector';
import { ImagePreview } from '../../components/ImagePreview';
import { ProductDescription } from '../../components/ProductDescription';
import Ionicons from '@expo/vector-icons/Ionicons';

const { width } = Dimensions.get('window');

export default function ProductDetail() {
  const router = useRouter();
  const { productId } = useLocalSearchParams<{ productId: string }>();
  const [product, setProduct] = React.useState<Product | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [imageLoading, setImageLoading] = React.useState(true);
  const [showPreview, setShowPreview] = React.useState(false);

  const headerOptions = {
    headerBackTitle: Platform.OS === 'ios' ? '' : undefined,
    headerTitle: '',
    headerTitleAlign: 'center' as const,
    headerTitleStyle: {
      fontSize: 16,
      fontWeight: '600' as const,
    },
    headerLeft: Platform.OS === 'android' ? () => (
      <TouchableOpacity 
        onPress={() => router.back()}
        style={styles.headerButton}
      >
        <View style={styles.headerLeft}>
          <Ionicons name="arrow-back" size={24} color="#000" />
          <Text style={styles.headerLeftText}>Lonca</Text>
        </View>
      </TouchableOpacity>
    ) : undefined,
  };

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const productData = dataService.getProductById(productId);
      if (productData) {
        setProduct(productData);
      } else {
        setError('Product not found');
      }
    } catch (err) {
      setError('Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchProductDetails();
  }, [productId]);

  if (loading) {
    return (
      <>
        <Stack.Screen options={headerOptions} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <Stack.Screen options={headerOptions} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error || 'Product not found'}</Text>
        </View>
      </>
    );
  }

  const colors = dataService.getProductColors(product.productCode);
  const packPrice = product.price * product.seriesItemQuantity;

  return (
    <>
      <Stack.Screen 
        options={{
          ...headerOptions,
          headerTitle: product?.productCode || '',
        }}
      />
      <ScrollView style={styles.container}>
        <TouchableOpacity onPress={() => setShowPreview(true)}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: product.mainImage }}
              style={styles.mainImage}
              onLoadStart={() => setImageLoading(true)}
              onLoadEnd={() => setImageLoading(false)}
              resizeMode="cover"
            />
            {imageLoading && (
              <View style={styles.imageLoadingContainer}>
                <ActivityIndicator size="large" color="#000" />
              </View>
            )}
          </View>
        </TouchableOpacity>

        {colors.length > 0 && (
          <View style={styles.colorSection}>
            <Text style={styles.sectionTitle}>Available Colors</Text>
            <ColorSelector
              colors={colors}
              selectedColor={product.color}
            />
          </View>
        )}

        <View style={styles.detailsContainer}>
          <Text style={styles.productName}>
            {product.name.split('-')[1]?.trim() || product.name}
          </Text>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>${product.price.toFixed(2)}</Text>
            {product.seriesItemQuantity > 1 && (
              <Text style={styles.packPrice}>
                Pack: ${packPrice.toFixed(2)} ({product.seriesItemQuantity} items)
              </Text>
            )}
          </View>

          <ProductDescription descriptionDetails={product.descriptionDetails} />

          {product.seriesName && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Series</Text>
              <View style={styles.seriesContainer}>
                <View style={styles.seriesCard}>
                  <Text style={styles.seriesName}>{product.seriesName}</Text>
                  <View style={styles.seriesQuantityBadge}>
                    <Text style={styles.seriesQuantityText}>
                      {product.seriesItemQuantity} items
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      <ImagePreview
        visible={showPreview}
        images={[product.mainImage, ...product.images]}
        onClose={() => setShowPreview(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  imageContainer: {
    width: width,
    height: width,
    backgroundColor: '#f5f5f5',
    position: 'relative',
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  imageLoadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  colorSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  detailsContainer: {
    padding: 16,
  },
  productName: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
  },
  priceContainer: {
    marginBottom: 16,
  },
  price: {
    fontSize: 20,
    fontWeight: '500',
    color: '#000',
  },
  packPrice: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  seriesContainer: {
    marginTop: 8,
  },
  seriesCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 2,
  },
  seriesName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  seriesQuantityBadge: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  seriesQuantityText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  headerButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerLeftText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '400',
  },
}); 