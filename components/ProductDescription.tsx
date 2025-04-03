import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ProductDescriptionProps {
  descriptionDetails: {
    fabric: string;
    modelMeasurements: string;
    sampleSize: string;
    productMeasurements: string;
  };
}

export function ProductDescription({ descriptionDetails }: ProductDescriptionProps) {
  const formatMeasurements = (text: string) => {
    if (!text) return null;
    
    const cleanText = text
      .replace(/Model Measurements:\s*Model Measurements:/i, 'Model Measurements:')
      .replace(/Product Dimensions:\s*Product Dimensions:/i, 'Product Dimensions:');

    return cleanText;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Description</Text>
      
      <View style={styles.section}>
        {descriptionDetails.fabric && (
          <View style={styles.row}>
            <Text style={styles.label}>Fabric:</Text>
            <Text style={styles.value}>{descriptionDetails.fabric}</Text>
          </View>
        )}

        {descriptionDetails.modelMeasurements && (
          <View style={styles.row}>
            <Text style={styles.label}>Model Measurements:</Text>
            <Text style={styles.value}>
              {formatMeasurements(descriptionDetails.modelMeasurements)}
            </Text>
          </View>
        )}

        {descriptionDetails.productMeasurements && (
          <View style={styles.row}>
            <Text style={styles.label}>Product Measurements:</Text>
            <Text style={styles.value}>
              {formatMeasurements(descriptionDetails.productMeasurements)}
            </Text>
          </View>
        )}

        {descriptionDetails.sampleSize && (
          <View style={styles.row}>
            <Text style={styles.label}>Sample Size:</Text>
            <Text style={styles.value}>{descriptionDetails.sampleSize}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  section: {
    gap: 12,
  },
  row: {
    gap: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  value: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
}); 