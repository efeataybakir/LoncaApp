import React from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../types/product';
import { dataService } from '../services/dataService';
import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';

const headerOptions = {
  headerTitle: 'Lonca',
  headerTitleAlign: 'center' as const,
  headerTitleStyle: {
    fontSize: 18,
    fontWeight: '600' as const,
  },
  headerRight: () => (
    <Ionicons 
      name="search-outline" 
      size={24} 
      color="#000" 
      style={styles.headerIcon} 
    />
  ),
};

export default function HomeScreen() {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [products, setProducts] = React.useState<Product[]>([]);

  const fetchProducts = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = dataService.getProducts();
      setProducts(response.products);
    } catch (err) {
      setError('Failed to load products. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={products}
        renderItem={({ item }) => <ProductCard product={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        numColumns={2}
        columnWrapperStyle={styles.row}
        refreshing={loading}
        onRefresh={fetchProducts}
      />
    );
  };

  return (
    <>
      <Stack.Screen options={headerOptions} />
      <View style={styles.container}>
        {renderContent()}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    paddingHorizontal: 8,
    paddingVertical: 16,
  },
  row: {
    justifyContent: 'center',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    padding: 16,
  },
  headerIcon: {
    marginRight: 16,
  },
}); 