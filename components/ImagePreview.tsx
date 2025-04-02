import React from 'react';
import {
  View,
  Modal,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ImagePreviewProps {
  visible: boolean;
  images: string[];
  onClose: () => void;
}

const { width, height } = Dimensions.get('window');

export function ImagePreview({ visible, images, onClose }: ImagePreviewProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const handleClose = () => {
    setCurrentIndex(0);
    onClose();
  };

  const renderItem = ({ item }: { item: string }) => (
    <Image
      source={{ uri: item }}
      style={styles.image}
      resizeMode="contain"
    />
  );

  const renderPagination = () => (
    <View style={styles.pagination}>
      {images.map((_, index) => (
        <View
          key={index}
          style={[
            styles.paginationDot,
            index === currentIndex && styles.paginationDotActive,
          ]}
        />
      ))}
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
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
          />
          
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleClose}
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          >
            <View style={styles.closeButtonBackground}>
              <Ionicons name="close" size={24} color="#000" />
            </View>
          </TouchableOpacity>
        </View>

        {renderPagination()}
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 16 : 16,
    right: 16,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  closeButtonBackground: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  image: {
    width,
    height: height * 0.8,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#fff',
  },
}); 