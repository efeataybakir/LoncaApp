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
import { useLocalSearchParams, Stack } from 'expo-router';
import { dataService } from '../../services/dataService';
import { Product } from '../../types/product';
import { ColorSelector } from '../../components/ColorSelector';
import { ImagePreview } from '../../components/ImagePreview';

const { width } = Dimensions.get('window');

const headerOptions = {
  headerBackTitle: 'Products',
  headerTitle: '',
  headerTitleAlign: 'center' as const,
  headerTitleStyle: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
};

export default function ProductDetail() {
  const { productId } = useLocalSearchParams<{ productId: string }>();
  const [product, setProduct] = React.useState<Product | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [imageLoading, setImageLoading] = React.useState(true);
  const [showPreview, setShowPreview] = React.useState(false);

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

  const renderDescription = () => {
    if (!product?.descriptionDetails) return null;
    const { fabric, modelMeasurements, productMeasurements, sampleSize } = product.descriptionDetails;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Description</Text>
        <View style={styles.descriptionContainer}>
          {fabric && (
            <Text style={styles.description}>Fabric: {fabric}</Text>
          )}
          {modelMeasurements && (
            <Text style={styles.description}>
              Model Measurements: {modelMeasurements}
            </Text>
          )}
          {productMeasurements && (
            <Text style={styles.description}>
              Product Measurements: {productMeasurements}
            </Text>
          )}
          {sampleSize && (
            <Text style={styles.description}>Sample Size: {sampleSize}</Text>
          )}
        </View>
      </View>
    );
  };

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

  return (
    <>
      <Stack.Screen
        options={{
          ...headerOptions,
          headerTitle: product.productCode,
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
          <Text style={styles.price}>${product.price.toFixed(2)}</Text>

          {renderDescription()}

          {product.seriesName && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Series</Text>
              <Text style={styles.seriesInfo}>
                {product.seriesName} ({product.seriesItemQuantity} items)
              </Text>
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
  price: {
    fontSize: 20,
    fontWeight: '500',
    color: '#000',
    marginBottom: 16,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  descriptionContainer: {
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
    marginBottom: 8,
  },
  seriesInfo: {
    fontSize: 16,
    color: '#666',
  },
}); 