import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ProductDescriptionProps {
  descriptionDetails: {
    fabric: string;
    modelMeasurements: string;
    sampleSize: string;
    productMeasurements: string;
  };
}

export function ProductDescription({ descriptionDetails }: ProductDescriptionProps) {
  const [expanded, setExpanded] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  const toggleExpand = () => {
    const toValue = expanded ? 0 : 1;
    Animated.timing(animation, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setExpanded(!expanded);
  };

  const formatMeasurements = (text: string) => {
    if (!text) return null;
    
    const cleanText = text
      .replace(/Model Measurements:\s*Model Measurements:/i, 'Model Measurements:')
      .replace(/Product Dimensions:\s*Product Dimensions:/i, 'Product Dimensions:');

    return cleanText;
  };

  const maxHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 500],
  });

  const rotateZ = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.header} 
        onPress={toggleExpand}
        activeOpacity={0.7}
      >
        <Text style={styles.title}>Product Details</Text>
        <Animated.View style={{ transform: [{ rotateZ }] }}>
          <Ionicons name="chevron-down" size={20} color="#666" />
        </Animated.View>
      </TouchableOpacity>
      
      <Animated.View style={[styles.content, { maxHeight }]}>
        <View style={styles.section}>
          {descriptionDetails.fabric && (
            <View style={styles.row}>
              <Text style={styles.label}>Fabric</Text>
              <Text style={styles.value}>{descriptionDetails.fabric}</Text>
            </View>
          )}

          {descriptionDetails.modelMeasurements && (
            <View style={styles.row}>
              <Text style={styles.label}>Model Measurements</Text>
              <Text style={styles.value}>
                {formatMeasurements(descriptionDetails.modelMeasurements)}
              </Text>
            </View>
          )}

          {descriptionDetails.productMeasurements && (
            <View style={styles.row}>
              <Text style={styles.label}>Product Measurements</Text>
              <Text style={styles.value}>
                {formatMeasurements(descriptionDetails.productMeasurements)}
              </Text>
            </View>
          )}

          {descriptionDetails.sampleSize && (
            <View style={styles.row}>
              <Text style={styles.label}>Sample Size</Text>
              <Text style={styles.value}>{descriptionDetails.sampleSize}</Text>
            </View>
          )}
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginVertical: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  content: {
    overflow: 'hidden',
  },
  section: {
    padding: 16,
    gap: 16,
  },
  row: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },
}); 