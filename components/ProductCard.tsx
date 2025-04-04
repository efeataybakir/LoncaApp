import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Product } from '../types/product';
import { ImagePreview } from './ImagePreview';
import { LinearGradient } from 'expo-linear-gradient';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps): React.JSX.Element {
  const router = useRouter();
  const [imageLoading, setImageLoading] = React.useState(true);
  const [showPreview, setShowPreview] = React.useState(false);
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      router.push(`/products/${product.id}`);
    });
  };

  const handleLongPress = () => {
    setShowPreview(true);
  };

  const displayName = product.name.split('-')[1]?.trim() || product.name;
  const packPrice = product.price * product.seriesItemQuantity;

  return (
    <Animated.View style={[styles.container, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity
        activeOpacity={0.9}
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
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.1)']}
            style={styles.gradient}
          />
        </View>

        <View style={styles.details}>
          <Text style={styles.vendorName}>{product.vendorName}</Text>
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
      </TouchableOpacity>

      <ImagePreview
        visible={showPreview}
        images={[product.mainImage, ...product.images]}
        onClose={() => setShowPreview(false)}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: Platform.OS === 'ios' ? '#00000040' : '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginHorizontal: 4,
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#f8f8f8',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '30%',
  },
  details: {
    padding: 12,
    backgroundColor: '#fff',
  },
  vendorName: {
    fontSize: 11,
    fontWeight: '700',
    color: '#666',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  name: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: '#1a1a1a',
    lineHeight: 18,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    flexWrap: 'wrap',
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  packPrice: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
}); 