import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Platform,
  SafeAreaView,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { dataService } from '../../services/dataService';
import { Product } from '../../types/product';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

interface Vendor {
  id: string;
  name: string;
  logo: string;
  productCount: number;
}

export default function Vendors() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVendors();
  }, []);

  const loadVendors = async () => {
    try {
      setLoading(true);
      const response = await dataService.getProducts();
      if (!response?.products) {
        console.error('No products data received');
        return;
      }
      
      const vendorMap = new Map<string, Vendor>();
      response.products.forEach((product: Product) => {
        if (!vendorMap.has(product.vendorName)) {
          vendorMap.set(product.vendorName, {
            id: product.vendorName.toLowerCase().replace(/\s+/g, '-'),
            name: product.vendorName,
            logo: product.images[0], 
            productCount: 1,
          });
        } else {
          const vendor = vendorMap.get(product.vendorName);
          if (vendor) {
            vendor.productCount += 1;
          }
        }
      });
      setVendors(Array.from(vendorMap.values()));
    } catch (error) {
      console.error('Error loading vendors:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredVendors = vendors.filter(vendor =>
    vendor.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderVendorCard = ({ item }: { item: Vendor }) => (
    <TouchableOpacity
      style={styles.vendorCard}
      onPress={() => {
        // @ts-ignore
        router.push('/vendor/' + item.id);
      }}
      activeOpacity={0.8}
    >
      <Image source={{ uri: item.logo }} style={styles.vendorLogo} />
      <View style={styles.vendorInfo}>
        <Text style={styles.vendorName}>{item.name}</Text>
        <Text style={styles.productCount}>
          {item.productCount} {item.productCount === 1 ? 'Product' : 'Products'}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#999" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: 'Vendors',
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerShadowVisible: false,
          headerLeft: () => null,
          contentStyle: { backgroundColor: '#fff' },
          headerTransparent: false,
          headerTitleStyle: {
            fontSize: 16,
            fontWeight: '600',
            color: '#1a1a1a',
          },
        }}
      />
      <View style={styles.content}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search vendors"
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
        <FlatList
          data={filteredVendors}
          renderItem={renderVendorCard}
          keyExtractor={item => item.id}
          contentContainerStyle={[
            styles.list,
            {
              paddingBottom: insets.bottom + 16,
              flexGrow: filteredVendors.length === 0 ? 1 : undefined,
            },
          ]}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Ionicons name="search" size={64} color="#ccc" />
              <Text style={styles.emptyText}>
                {searchQuery ? 'No vendors found' : loading ? 'Loading vendors...' : 'No vendors available'}
              </Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  list: {
    padding: 16,
    paddingTop: 0,
  },
  vendorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  vendorLogo: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f8f8f8',
  },
  vendorInfo: {
    flex: 1,
    marginLeft: 12,
  },
  vendorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  productCount: {
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
  },
}); 