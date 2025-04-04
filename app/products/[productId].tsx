import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Platform,
  Animated,
  StatusBar,
  Share,
} from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { dataService } from '../../services/dataService';
import { Product, ProductColor } from '../../types/product';
import { ImagePreview } from '../../components/ImagePreview';
import { ProductDescription } from '../../components/ProductDescription';
import { ProductReview } from '../../components/ProductReview';
import { RelatedProducts } from '../../components/RelatedProducts';
import { ImageGallery } from '../../components/ImageGallery';
import { MOCK_REVIEWS } from '../../src/data/reviews';
import { ColorSelector } from '../../components/ColorSelector';

const { width } = Dimensions.get('window');
const IMAGE_HEIGHT = width * 1.3;

export default function ProductDetail() {
  const router = useRouter();
  const { productId } = useLocalSearchParams<{ productId: string }>();
  const [product, setProduct] = React.useState<Product | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [showPreview, setShowPreview] = React.useState(false);
  const [selectedColor, setSelectedColor] = React.useState<string>('');
  const scrollY = React.useRef(new Animated.Value(0)).current;

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const handleShare = async () => {
    if (product) {
      try {
        await Share.share({
          message: `Check out this product: ${product.name} - $${product.price}`,
          url: product.mainImage,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }
  };

  const headerOptions: NativeStackNavigationOptions = {
    headerTransparent: true,
    headerBlurEffect: Platform.OS === 'ios' ? 'light' : undefined,
    headerBackground: () => (
      <Animated.View 
        style={[
          styles.headerBackground,
          { opacity: headerOpacity }
        ]}
      >
        <BlurView intensity={100} style={StyleSheet.absoluteFill} />
      </Animated.View>
    ),
    headerTitle: () => (
      <Animated.Text 
        style={[
          styles.headerTitle,
          { opacity: headerOpacity }
        ]}
      >
        {product?.productCode || ''}
      </Animated.Text>
    ),
    headerLeft: () => (
      <TouchableOpacity 
        onPress={() => router.back()}
        style={styles.headerButton}
      >
        <Ionicons name="chevron-back" size={24} color="#000" />
      </TouchableOpacity>
    ),
    headerRight: () => (
      <View style={styles.headerButtons}>
        <TouchableOpacity 
          onPress={handleShare}
          style={styles.headerButton}
        >
          <Ionicons name="share-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>
    ),
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
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <Stack.Screen options={headerOptions} />
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#666" />
          <Text style={styles.errorText}>{error || 'Product not found'}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={fetchProductDetails}
          >
            <Text style={styles.retryText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  }

  const colors = dataService.getProductColors(product.productCode);
  const relatedProducts = dataService.getRelatedProducts(product.productCode, product.id);
  const packPrice = product.price * product.seriesItemQuantity;

  const handleColorSelect = (color: ProductColor) => {
    setSelectedColor(color.name);
    router.push(`/products/${color.productId}`);
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <Stack.Screen options={headerOptions} />
      
      <Animated.ScrollView 
        style={styles.container}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageGalleryContainer}>
          <ImageGallery
            images={[product.mainImage, ...product.images]}
            onImagePress={() => setShowPreview(true)}
          />
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.header}>
            <Text style={styles.productName}>
              {product.name.split('-')[1]?.trim() || product.name}
            </Text>
            <Text style={styles.vendorName}>{product.vendorName}</Text>
          </View>

          <View style={styles.priceContainer}>
            <Text style={styles.price}>${product.price.toFixed(2)}</Text>
            {product.seriesItemQuantity > 1 && (
              <View style={styles.packPriceContainer}>
                <Text style={styles.packPrice}>
                  Pack: ${packPrice.toFixed(2)}
                </Text>
                <View style={styles.quantityBadge}>
                  <Text style={styles.quantityText}>
                    {product.seriesItemQuantity} items
                  </Text>
                </View>
              </View>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Color</Text>
            <ColorSelector
              colors={colors}
              selectedColor={selectedColor}
              onColorSelect={handleColorSelect}
            />
          </View>

          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>About This Product</Text>
            <View style={styles.descriptionCard}>
              <Text style={styles.descriptionText}>
                {product.description || 'No description available for this product.'}
              </Text>
              
              <View style={styles.productInfoContainer}>
                <View style={styles.productInfoRow}>
                  <Ionicons name="barcode-outline" size={18} color="#666" />
                  <Text style={styles.productInfoText}>Product Code: {product.productCode}</Text>
                </View>
                
                <View style={styles.productInfoRow}>
                  <Ionicons name="color-palette-outline" size={18} color="#666" />
                  <Text style={styles.productInfoText}>Color: {product.color}</Text>
                </View>
                
                <View style={styles.productInfoRow}>
                  <Ionicons name="business-outline" size={18} color="#666" />
                  <Text style={styles.productInfoText}>Vendor: {product.vendorName}</Text>
                </View>
              </View>
            </View>
          </View>

          {product.descriptionDetails && (
            <ProductDescription descriptionDetails={product.descriptionDetails} />
          )}

          <ProductReview
            rating={4.7}
            totalReviews={24}
            reviews={MOCK_REVIEWS}
            onSeeAllPress={() => {}}
          />

          {product.seriesName && (
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
          )}

          {relatedProducts.length > 0 && (
            <RelatedProducts products={relatedProducts} />
          )}
        </View>
      </Animated.ScrollView>

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
  headerBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    marginHorizontal: 4,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 12,
  },
  retryButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  imageGalleryContainer: {
    height: IMAGE_HEIGHT,
    width: '100%',
    backgroundColor: '#fff',
  },
  contentContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    paddingTop: 24,
    paddingHorizontal: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  header: {
    marginBottom: 16,
  },
  productName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
    lineHeight: 32,
  },
  vendorName: {
    fontSize: 16,
    color: '#666',
  },
  priceContainer: {
    marginBottom: 24,
  },
  price: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
  },
  packPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  packPrice: {
    fontSize: 16,
    color: '#666',
    marginRight: 8,
  },
  quantityBadge: {
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  quantityText: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
  },
  colorOptions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  colorOption: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  selectedColorOption: {
    borderWidth: 2,
    borderColor: '#000',
  },
  descriptionSection: {
    marginBottom: 24,
  },
  descriptionCard: {
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    padding: 16,
  },
  descriptionText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 16,
  },
  productInfoContainer: {
    gap: 12,
  },
  productInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  productInfoText: {
    fontSize: 14,
    color: '#666',
  },
  seriesContainer: {
    marginBottom: 24,
  },
  seriesCard: {
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  seriesName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  seriesQuantityBadge: {
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  seriesQuantityText: {
    fontSize: 14,
    color: '#666',
  },
}); 