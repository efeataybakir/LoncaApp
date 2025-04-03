import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Product } from '../types/product';
import { ImagePreview } from './ImagePreview';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const [imageLoading, setImageLoading] = React.useState(true);
  const [showPreview, setShowPreview] = React.useState(false);

  const handlePress = () => {
    router.push(`/products/${product.id}`);
  };

  const handleLongPress = () => {
    setShowPreview(true);
  };

  const handleClosePreview = () => {
    setShowPreview(false);
  };

  const displayName = product.name.split('-')[1]?.trim() || product.name;
  const packPrice = product.price * product.seriesItemQuantity;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      onLongPress={handleLongPress}
      delayLongPress={500}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.mainImage }}
          style={styles.image}
          onLoadStart={() => setImageLoading(true)}
          onLoadEnd={() => setImageLoading(false)}
          resizeMode="cover"
        />
        {imageLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#000" />
          </View>
        )}
      </View>

      <View style={styles.details}>
        <Text style={styles.name} numberOfLines={2}>
          {displayName}
        </Text>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>${product.price.toFixed(2)}</Text>
          {product.seriesItemQuantity > 1 && (
            <Text style={styles.packPrice}>
              Pack: ${packPrice.toFixed(2)} ({product.seriesItemQuantity} items)
            </Text>
          )}
        </View>
      </View>

      <ImagePreview
        visible={showPreview}
        images={[product.mainImage, ...product.images]}
        onClose={handleClosePreview}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginHorizontal: 4,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  details: {
    padding: 12,
  },
  name: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  priceContainer: {
    gap: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  packPrice: {
    fontSize: 12,
    color: '#666',
  },
}); 