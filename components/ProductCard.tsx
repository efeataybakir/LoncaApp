import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Product } from '../types/product';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/product/${product.id}`);
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <Image
        source={{ uri: product.mainImage }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.infoContainer}>
        <Text style={styles.brand}>{product.vendorName}</Text>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={styles.price}>${product.price.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  infoContainer: {
    padding: 12,
  },
  brand: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
}); 