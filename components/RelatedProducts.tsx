import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Product } from '../types/product';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.7;
const CARD_HEIGHT = CARD_WIDTH * 1.2;

interface RelatedProductsProps {
  products: Product[];
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  const router = useRouter();

  if (!products.length) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>You May Also Like</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        decelerationRate="fast"
        snapToInterval={CARD_WIDTH + 16}
        snapToAlignment="center"
      >
        {products.map((product) => (
          <TouchableOpacity
            key={product.id}
            style={styles.card}
            onPress={() => router.push(`/products/${product.id}`)}
            activeOpacity={0.9}
          >
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: product.mainImage }}
                style={styles.image}
                resizeMode="cover"
              />
            </View>
            <View style={styles.details}>
              <Text style={styles.vendorName}>{product.vendorName}</Text>
              <Text style={styles.productName} numberOfLines={2}>
                {product.name.split('-')[1]?.trim() || product.name}
              </Text>
              <Text style={styles.price}>${product.price.toFixed(2)}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    paddingVertical: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 16,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  imageContainer: {
    width: '100%',
    height: CARD_HEIGHT,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f8f8f8',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  details: {
    padding: 12,
  },
  vendorName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1a1a1a',
    marginBottom: 8,
    lineHeight: 20,
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
}); 