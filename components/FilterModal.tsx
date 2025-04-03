import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  vendors: string[];
  selectedVendors: string[];
  onVendorSelect: (vendor: string) => void;
  priceRange: { min: number; max: number };
  onPriceRangeChange: (range: { min: number; max: number }) => void;
  onApply: () => void;
  maxPrice: number;
}

export function FilterModal({
  visible,
  onClose,
  vendors,
  selectedVendors,
  onVendorSelect,
  priceRange,
  onPriceRangeChange,
  onApply,
  maxPrice,
}: FilterModalProps) {
  const [localPriceRange, setLocalPriceRange] = React.useState([
    priceRange.min,
    priceRange.max,
  ]);
  const { width } = Dimensions.get('window');
  const SLIDER_WIDTH = width - 80;

  React.useEffect(() => {
    setLocalPriceRange([priceRange.min, priceRange.max]);
  }, [priceRange]);

  const handlePriceChange = (values: number[]) => {
    setLocalPriceRange(values);
  };

  const handleApply = () => {
    onPriceRangeChange({
      min: localPriceRange[0],
      max: localPriceRange[1],
    });
    onApply();
  };

  const handleReset = () => {
    const resetPriceRange = { min: 0, max: maxPrice };
    setLocalPriceRange([0, maxPrice]);
    onPriceRangeChange(resetPriceRange);

    selectedVendors.forEach(vendor => {
      onVendorSelect(vendor);
    });

    onApply();
  };

  const CustomMarker = () => (
    <View style={styles.markerContainer}>
      <View style={styles.marker} />
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Filters</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            <View style={styles.resetContainer}>
              <TouchableOpacity
                style={styles.resetButton}
                onPress={handleReset}
              >
                <Ionicons name="refresh" size={16} color="#666" />
                <Text style={styles.resetText}>Reset Filters</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Price Range</Text>
              <View style={styles.priceRangeContainer}>
                <View style={styles.priceLabels}>
                  <Text style={styles.priceValue}>
                    ${Math.round(localPriceRange[0])}
                  </Text>
                  <Text style={styles.priceValue}>
                    ${Math.round(localPriceRange[1])}
                  </Text>
                </View>
                <View style={styles.sliderContainer}>
                  <MultiSlider
                    values={localPriceRange}
                    min={0}
                    max={maxPrice}
                    step={1}
                    sliderLength={SLIDER_WIDTH}
                    onValuesChange={handlePriceChange}
                    selectedStyle={styles.selectedTrack}
                    unselectedStyle={styles.unselectedTrack}
                    containerStyle={styles.sliderContainerStyle}
                    trackStyle={styles.track}
                    customMarker={CustomMarker}
                    enabledTwo={true}
                  />
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Vendors</Text>
              <View style={styles.vendorList}>
                {vendors.map((vendor) => (
                  <TouchableOpacity
                    key={vendor}
                    style={[
                      styles.vendorItem,
                      selectedVendors.includes(vendor) && styles.selectedVendor,
                    ]}
                    onPress={() => onVendorSelect(vendor)}
                  >
                    <Text
                      style={[
                        styles.vendorText,
                        selectedVendors.includes(vendor) && styles.selectedVendorText,
                      ]}
                    >
                      {vendor}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  priceRangeContainer: {
    marginTop: 8,
    paddingHorizontal: 16,
  },
  priceLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  priceValue: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  sliderContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  sliderContainerStyle: {
    height: 50,
  },
  track: {
    height: 4,
    borderRadius: 2,
  },
  selectedTrack: {
    backgroundColor: '#000',
  },
  unselectedTrack: {
    backgroundColor: '#ddd',
  },
  markerContainer: {
    width: 24,
    height: 24,
    backgroundColor: '#fff',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  marker: {
    width: 12,
    height: 12,
    backgroundColor: '#000',
    borderRadius: 6,
  },
  vendorList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  vendorItem: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#eee',
  },
  selectedVendor: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  vendorText: {
    color: '#333',
  },
  selectedVendorText: {
    color: '#fff',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  applyButton: {
    backgroundColor: '#000',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resetContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    gap: 8,
  },
  resetText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
}); 