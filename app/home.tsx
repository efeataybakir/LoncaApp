import React from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../types/product';
import { dataService } from '../services/dataService';
import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { SearchBar } from '../components/SearchBar';
import { FilterModal } from '../components/FilterModal';

type SortOption = 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';

const headerOptions = {
  headerTitle: 'Lonca',
  headerTitleAlign: 'center' as const,
  headerTitleStyle: {
    fontSize: 18,
    fontWeight: '600' as const,
  },
};

export default function HomeScreen() {
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

  const fetchProducts = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = dataService.getProducts();
      setProducts(response.products);
      setFilteredProducts(response.products);
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
      <>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onClear={handleClearSearch}
        />
        <View style={styles.filterBar}>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowFilterModal(true)}
          >
            <Ionicons name="filter" size={20} color="#000" />
            <Text style={styles.filterButtonText}>Filter</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.sortButton}
            onPress={handleSortPress}
          >
            <Ionicons name={getSortIcon()} size={20} color="#000" />
            <Text style={styles.sortButtonText}>
              {sortOption.includes('price') ? 'Price' : 'Name'}
            </Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={filteredProducts}
          renderItem={({ item }) => <ProductCard product={item} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          numColumns={2}
          columnWrapperStyle={styles.row}
          refreshing={loading}
          onRefresh={fetchProducts}
        />
      </>
    );
  };

  return (
    <>
      <Stack.Screen options={headerOptions} />
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
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    padding: 16,
  },
  filterBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  filterButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 8,
    gap: 4,
  },
  sortButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 8,
    gap: 4,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  sortButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
}); 