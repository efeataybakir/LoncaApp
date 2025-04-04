import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  Animated,
  Platform,
  StatusBar,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { dataService } from '../../services/dataService';
import { Product } from '../../types/product';
import { ProductCard } from '../../components/ProductCard';
import { SearchBar } from '../../components/SearchBar';
import { FilterModal } from '../../components/FilterModal';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type SortOption = 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';

const headerOptions = {
  headerTitle: 'Lonca',
  headerTitleAlign: 'center' as const,
  headerTitleStyle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#1a1a1a',
  },
  headerStyle: {
    backgroundColor: '#fff',
  },
  headerShadowVisible: false,
};

const EmptyState = () => (
  <View style={styles.emptyContainer}>
    <Ionicons name="search" size={48} color="#ccc" />
    <Text style={styles.emptyTitle}>No Products Found</Text>
    <Text style={styles.emptyText}>Try adjusting your filters or search terms</Text>
  </View>
);

const LoadingState = () => (
  <View style={styles.centerContainer}>
    <ActivityIndicator size="large" color="#1a1a1a" />
    <Text style={styles.loadingText}>Loading products...</Text>
  </View>
);

export default function HomeScreen(): React.JSX.Element {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [products, setProducts] = React.useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = React.useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showFilterModal, setShowFilterModal] = React.useState(false);
  const [selectedVendors, setSelectedVendors] = React.useState<string[]>([]);
  const [priceRange, setPriceRange] = React.useState({ min: 0, max: 1000 });
  const [sortOption, setSortOption] = React.useState<SortOption>('price-asc');

  const vendors = React.useMemo(() => {
    const uniqueVendors = new Set(products.map(p => p.vendorName));
    return Array.from(uniqueVendors).sort();
  }, [products]);

  const maxPrice = React.useMemo(() => {
    if (products.length === 0) return 1000;
    return Math.ceil(Math.max(...products.map(p => p.price)));
  }, [products]);

  React.useEffect(() => {
    if (products.length > 0) {
      setPriceRange(prev => ({
        min: prev.min,
        max: Math.min(prev.max, maxPrice),
      }));
    }
  }, [maxPrice]);

  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = dataService.getProducts();
        setProducts(response.products);
        setFilteredProducts(response.products);
      } catch (error) {
        setError('Failed to load products. Please try again later.');
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleVendorSelect = (vendor: string) => {
    setSelectedVendors(prev =>
      prev.includes(vendor)
        ? prev.filter(v => v !== vendor)
        : [...prev, vendor]
    );
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleSortPress = () => {
    setSortOption(prev => {
      switch (prev) {
        case 'price-asc':
          return 'price-desc';
        case 'price-desc':
          return 'name-asc';
        case 'name-asc':
          return 'name-desc';
        case 'name-desc':
          return 'price-asc';
        default:
          return 'price-asc';
      }
    });
  };

  const getSortIcon = () => {
    switch (sortOption) {
      case 'price-asc':
        return 'arrow-up';
      case 'price-desc':
        return 'arrow-down';
      case 'name-asc':
        return 'text';
      case 'name-desc':
        return 'text-outline';
      default:
        return 'arrow-up';
    }
  };

  const applyFilters = React.useCallback(() => {
    let filtered = [...products];

    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.vendorName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedVendors.length > 0) {
      filtered = filtered.filter(product =>
        selectedVendors.includes(product.vendorName)
      );
    }

    filtered = filtered.filter(product =>
      product.price >= priceRange.min && product.price <= priceRange.max
    );

    filtered.sort((a, b) => {
      switch (sortOption) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  }, [products, searchQuery, selectedVendors, priceRange, sortOption]);

  React.useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const renderContent = () => {
    if (loading) {
      return <LoadingState />;
    }

    if (error) {
      return (
        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle" size={48} color="#666" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => {
            setLoading(true);
            applyFilters();
          }}>
            <Text style={styles.retryText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onClear={handleClearSearch}
        />
        <View style={styles.filterBar}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedVendors.length > 0 && styles.activeFilterButton
            ]}
            onPress={() => setShowFilterModal(true)}
          >
            <View style={styles.buttonContent}>
              <Ionicons 
                name="filter" 
                size={20} 
                color={selectedVendors.length > 0 ? "#007AFF" : "#1a1a1a"} 
              />
              <Text style={[
                styles.filterButtonText,
                selectedVendors.length > 0 && styles.activeButtonText
              ]}>
                Filter {selectedVendors.length > 0 ? `(${selectedVendors.length})` : ''}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.sortButton}
            onPress={handleSortPress}
          >
            <View style={styles.buttonContent}>
              <Ionicons name={getSortIcon()} size={20} color="#1a1a1a" />
              <Text style={styles.sortButtonText}>
                {sortOption.includes('price') ? 'Price' : 'Name'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <FlatList
          data={filteredProducts}
          renderItem={({ item }) => <ProductCard product={item} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.listContainer,
            filteredProducts.length === 0 && styles.emptyListContainer
          ]}
          numColumns={2}
          columnWrapperStyle={styles.row}
          refreshing={loading}
          onRefresh={applyFilters}
          ListEmptyComponent={EmptyState}
          showsVerticalScrollIndicator={false}
        />
      </>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen
        options={{
          title: 'Lonca',
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerShadowVisible: false,
          headerLeft: () => null,
          contentStyle: {
            backgroundColor: '#fff',
          },
          headerTransparent: false,
        }}
      />
      <View style={styles.container}>
        {renderContent()}
        <FilterModal
          visible={showFilterModal}
          onClose={() => setShowFilterModal(false)}
          vendors={vendors}
          selectedVendors={selectedVendors}
          onVendorSelect={handleVendorSelect}
          priceRange={priceRange}
          onPriceRangeChange={setPriceRange}
          onApply={() => setShowFilterModal(false)}
          maxPrice={maxPrice}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  listContainer: {
    paddingHorizontal: 12,
    paddingVertical: 16,
  },
  row: {
    justifyContent: 'space-between',
    marginHorizontal: -4,
  },
  filterBar: {
    flexDirection: 'row',
    padding: 12,
    paddingTop: 8,
    gap: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  filterButton: {
    flex: 1,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#f8f8f8',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  sortButton: {
    flex: 1,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#f8f8f8',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    gap: 6,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  sortButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 48,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  loadingText: {
    fontSize: 14,
    color: '#666',
    marginTop: 12,
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  retryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  emptyListContainer: {
    flexGrow: 1,
  },
  activeFilterButton: {
    borderColor: '#007AFF',
    backgroundColor: '#007AFF10',
  },
  activeButtonText: {
    color: '#007AFF',
  },
}); 