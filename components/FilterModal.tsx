import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Animated,
  Platform,
  KeyboardAvoidingView,
  SafeAreaView,
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
  const slideAnim = React.useRef(new Animated.Value(0)).current;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

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

  const modalTranslateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [300, 0],
  });

  return (
    <Modal
      visible={visible}
      transparent={true}
      onRequestClose={onClose}
      animationType="none"
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <Animated.View 
            style={[
              styles.modalContainer,
              { opacity: fadeAnim }
            ]}
          >
            <TouchableOpacity 
              style={styles.backdrop} 
              activeOpacity={1} 
              onPress={onClose}
            />
            <Animated.View 
              style={[
                styles.modalContent,
                {
                  transform: [{ translateY: modalTranslateY }],
                },
              ]}
            >
              <View style={styles.header}>
                <Text style={styles.title}>Filters</Text>
                <TouchableOpacity 
                  onPress={onClose}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons name="close" size={24} color="#1a1a1a" />
                </TouchableOpacity>
              </View>

              <ScrollView 
                style={styles.content}
                showsVerticalScrollIndicator={false}
                bounces={false}
              >
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
                      <View style={styles.priceBox}>
                        <Text style={styles.pricePrefix}>$</Text>
                        <Text style={styles.priceValue}>
                          {Math.round(localPriceRange[0])}
                        </Text>
                      </View>
                      <View style={styles.priceBox}>
                        <Text style={styles.pricePrefix}>$</Text>
                        <Text style={styles.priceValue}>
                          {Math.round(localPriceRange[1])}
                        </Text>
                      </View>
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
                        {selectedVendors.includes(vendor) && (
                          <Ionicons name="checkmark" size={18} color="#fff" />
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </ScrollView>

              <View style={styles.footer}>
                <TouchableOpacity 
                  style={styles.applyButton} 
                  onPress={handleApply}
                >
                  <Text style={styles.applyButtonText}>
                    Apply Filters
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </Animated.View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    margin: 0,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: Platform.OS === 'ios' ? '85%' : '90%',
    minHeight: 400,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
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
    color: '#1a1a1a',
    marginBottom: 16,
  },
  resetContainer: {
    marginBottom: 24,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
  },
  resetText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  priceRangeContainer: {
    marginTop: 8,
  },
  priceLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  priceBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 80,
  },
  pricePrefix: {
    fontSize: 14,
    color: '#666',
    marginRight: 2,
  },
  priceValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
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
    backgroundColor: '#007AFF',
  },
  unselectedTrack: {
    backgroundColor: '#f0f0f0',
  },
  markerContainer: {
    width: 24,
    height: 24,
    backgroundColor: '#fff',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  marker: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#007AFF',
  },
  vendorList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  vendorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    gap: 6,
  },
  selectedVendor: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  vendorText: {
    fontSize: 14,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  selectedVendorText: {
    color: '#fff',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  applyButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 