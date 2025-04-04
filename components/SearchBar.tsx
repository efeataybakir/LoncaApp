import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChangeText,
  onClear,
  placeholder = 'Search products...',
}: SearchBarProps) {
  const [isFocused, setIsFocused] = React.useState(false);
  const focusAnim = React.useRef(new Animated.Value(0)).current;
  const clearButtonScale = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.spring(clearButtonScale, {
      toValue: value.length > 0 ? 1 : 0,
      useNativeDriver: true,
      tension: 100,
      friction: 10,
    }).start();
  }, [value.length]);

  const handleFocus = () => {
    setIsFocused(true);
    Animated.spring(focusAnim, {
      toValue: 1,
      useNativeDriver: false,
      tension: 100,
      friction: 10,
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    Animated.spring(focusAnim, {
      toValue: 0,
      useNativeDriver: false,
      tension: 100,
      friction: 10,
    }).start();
  };

  const containerBorderColor = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#f0f0f0', '#007AFF'],
  });

  const containerBackgroundColor = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#f8f8f8', '#fff'],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.searchContainer,
          {
            borderColor: containerBorderColor,
            backgroundColor: containerBackgroundColor,
          },
        ]}
      >
        <Ionicons
          name="search"
          size={20}
          color={isFocused ? '#007AFF' : '#666'}
          style={styles.searchIcon}
        />
        <TextInput
          style={[styles.input, isFocused && styles.inputFocused]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#666"
          returnKeyType="search"
          onFocus={handleFocus}
          onBlur={handleBlur}
          selectionColor="#007AFF"
        />
        <Animated.View style={[styles.clearButton, { transform: [{ scale: clearButtonScale }] }]}>
          {value.length > 0 && (
            <TouchableOpacity onPress={onClear} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name="close-circle" size={20} color={isFocused ? '#007AFF' : '#666'} />
            </TouchableOpacity>
          )}
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1a1a1a',
    paddingVertical: Platform.OS === 'ios' ? 8 : 4,
  },
  inputFocused: {
    color: '#007AFF',
  },
  clearButton: {
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 