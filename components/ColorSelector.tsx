import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { ProductColor } from '../types/product';
import { useRouter } from 'expo-router';

interface ColorSelectorProps {
  colors: ProductColor[];
  selectedColor: string;
  onColorSelect?: (color: ProductColor) => void;
}

export function ColorSelector({ colors, selectedColor, onColorSelect }: ColorSelectorProps) {
  const router = useRouter();

  if (!colors.length) return null;

  const handleColorPress = (color: ProductColor) => {
    if (onColorSelect) {
      onColorSelect(color);
    } else {
      router.push(`/products/${color.productId}`);
    }
  };

  return (
    <View style={styles.container}>
      {colors.map((color) => (
        <TouchableOpacity
          key={color.productId}
          style={[
            styles.colorButton,
            color.name === selectedColor && styles.selectedColor,
          ]}
          onPress={() => handleColorPress(color)}
        >
          <Image
            source={{ uri: color.mainImage }}
            style={styles.colorImage}
            resizeMode="cover"
          />
          <Text style={styles.colorName}>{color.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 8,
  },
  colorButton: {
    width: 80,
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  selectedColor: {
    backgroundColor: '#e0e0e0',
    borderWidth: 1,
    borderColor: '#000',
  },
  colorImage: {
    width: 60,
    height: 60,
    borderRadius: 4,
    marginBottom: 4,
  },
  colorName: {
    fontSize: 12,
    textAlign: 'center',
  },
}); 