import React, { useState } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { ImagePreview } from './ImagePreview';

const { width } = Dimensions.get('window');
const THUMBNAIL_SIZE = 60;
const THUMBNAIL_SPACING = 8;

interface ImageGalleryProps {
  images: string[];
  onImagePress?: () => void;
}

export function ImageGallery({ images, onImagePress }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPreview, setShowPreview] = useState(false);

  const handleThumbnailPress = (index: number) => {
    setCurrentIndex(index);
  };

  const handleMainImagePress = () => {
    if (onImagePress) {
      onImagePress();
    } else {
      setShowPreview(true);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={handleMainImagePress}
        style={styles.mainImageContainer}
      >
        <Image
          source={{ uri: images[currentIndex] }}
          style={styles.mainImage}
          resizeMode="cover"
        />
      </TouchableOpacity>

      <View style={styles.thumbnailsWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.thumbnailsContainer}
        >
          {images.map((image, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleThumbnailPress(index)}
              style={[
                styles.thumbnailContainer,
                currentIndex === index && styles.selectedThumbnail,
              ]}
            >
              <Image
                source={{ uri: image }}
                style={styles.thumbnail}
                resizeMode="cover"
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ImagePreview
        visible={showPreview}
        images={images}
        initialIndex={currentIndex}
        onClose={() => setShowPreview(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    zIndex: 1,
  },
  mainImageContainer: {
    width: '100%',
    height: width * 1.3,
    backgroundColor: '#f8f8f8',
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  thumbnailsWrapper: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    zIndex: 2,
  },
  thumbnailsContainer: {
    paddingHorizontal: 16,
    gap: THUMBNAIL_SPACING,
  },
  thumbnailContainer: {
    width: THUMBNAIL_SIZE,
    height: THUMBNAIL_SIZE,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: '#f8f8f8',
  },
  selectedThumbnail: {
    borderColor: '#007AFF',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
}); 