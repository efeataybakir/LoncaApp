import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Product } from '../../types/product';
import { dataService } from '../../services/dataService';

const { width } = Dimensions.get('window');

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const [product, setProduct] = React.useState<Product | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [imageLoading, setImageLoading] = React.useState(true);

  React.useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = () => {
    if (!id) {
      setError('No product ID provided');
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      const data = dataService.getProductById(id as string);
      
      if (!data) {
        setError('Product not found');
        return;
      }
      
      setProduct(data);
    } catch (err) {
      setError('Failed to load product details. Please try again later.');
      console.error('Error fetching product:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error || !product) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error || 'Product not found'}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        {imageLoading && (
          <View style={styles.imageLoadingContainer}>
            <ActivityIndicator size="large" />
          </View>
        )}
        <Image
          source={{ uri: product.mainImage }}
          style={styles.mainImage}
          resizeMode="cover"
          onLoadStart={() => setImageLoading(true)}
          onLoadEnd={() => setImageLoading(false)}
          onError={() => {
            setImageLoading(false);
            setError('Failed to load product image');
          }}
        />
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={styles.vendorName}>{product.vendorName}</Text>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.price}>${product.price.toFixed(2)}</Text>
        
        <View style={styles.detailsContainer}>
          <Text style={styles.detailLabel}>Product Code:</Text>
          <Text style={styles.detailValue}>{product.productCode}</Text>
          
          {product.seriesName && (
            <>
              <Text style={styles.detailLabel}>Series:</Text>
              <Text style={styles.detailValue}>{product.seriesName}</Text>
            </>
          )}
          
          {product.descriptionDetails.fabric && (
            <>
              <Text style={styles.detailLabel}>Fabric:</Text>
              <Text style={styles.detailValue}>{product.descriptionDetails.fabric}</Text>
            </>
          )}
          
          {product.descriptionDetails.modelMeasurements && (
            <>
              <Text style={styles.detailLabel}>Model Measurements:</Text>
              <Text style={styles.detailValue}>{product.descriptionDetails.modelMeasurements}</Text>
            </>
          )}
          
          {product.descriptionDetails.productMeasurements && (
            <>
              <Text style={styles.detailLabel}>Product Measurements:</Text>
              <Text style={styles.detailValue}>{product.descriptionDetails.productMeasurements}</Text>
            </>
          )}
          
          {product.descriptionDetails.sampleSize && (
            <>
              <Text style={styles.detailLabel}>Sample Size:</Text>
              <Text style={styles.detailValue}>{product.descriptionDetails.sampleSize}</Text>
            </>
          )}
        </View>

        {product.images.length > 1 && (
          <View style={styles.imagesContainer}>
            <Text style={styles.sectionTitle}>More Images</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {product.images.map((image, index) => (
                <View key={index} style={styles.thumbnailContainer}>
                  <Image
                    source={{ uri: image }}
                    style={styles.thumbnail}
                    resizeMode="cover"
                  />
                </View>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  imageContainer: {
    width: width,
    height: width,
    position: 'relative',
  },
  imageLoadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  mainImage: {
    width: width,
    height: width,
  },
  contentContainer: {
    padding: 16,
  },
  vendorName: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  name: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  detailsContainer: {
    marginTop: 16,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    marginBottom: 12,
  },
  imagesContainer: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  thumbnailContainer: {
    marginRight: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  thumbnail: {
    width: 100,
    height: 100,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    padding: 16,
  },
}); 