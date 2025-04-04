import React, { useState } from 'react';
import {
  View,
  Modal,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Platform,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');

interface ImagePreviewProps {
  visible: boolean;
  images: string[];
  initialIndex?: number;
  onClose: () => void;
}

export function ImagePreview({ visible, images, initialIndex = 0, onClose }: ImagePreviewProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const handleClose = () => {
    setCurrentIndex(0);
    onClose();
  };

  const handleNext = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const renderItem = ({ item }: { item: string }) => (
    <View style={styles.imageWrapper}>
      <Image
        source={{ uri: item }}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <BlurView intensity={80} style={StyleSheet.absoluteFill} />
        
        <TouchableOpacity
          style={styles.closeButton}
          onPress={handleClose}
        >
          <Ionicons name="close" size={28} color="#fff" />
        </TouchableOpacity>

        <View style={styles.imageContainer}>
          <FlatList
            data={images}
            renderItem={renderItem}
            keyExtractor={(item, index) => `${item}-${index}`}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(event) => {
              const newIndex = Math.round(
                event.nativeEvent.contentOffset.x / width
              );
              setCurrentIndex(newIndex);
            }}
            initialScrollIndex={initialIndex}
            getItemLayout={(_, index) => ({
              length: width,
              offset: width * index,
              index,
            })}
          />
        </View>

        <View style={styles.navigationContainer}>
          <TouchableOpacity
            style={[styles.navButton, !currentIndex && styles.disabledButton]}
            onPress={handlePrevious}
            disabled={!currentIndex}
          >
            <Ionicons name="chevron-back" size={32} color="#fff" />
          </TouchableOpacity>

          <View style={styles.pagination}>
            {images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  currentIndex === index && styles.activeDot,
                ]}
              />
            ))}
          </View>

          <TouchableOpacity
            style={[styles.navButton, currentIndex === images.length - 1 && styles.disabledButton]}
            onPress={handleNext}
            disabled={currentIndex === images.length - 1}
          >
            <Ionicons name="chevron-forward" size={32} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 44 : 20,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageWrapper: {
    width: width,
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: width,
    height: height * 0.8,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  pagination: {
    flexDirection: 'row',
    gap: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  activeDot: {
    backgroundColor: '#fff',
    width: 24,
  },
}); 