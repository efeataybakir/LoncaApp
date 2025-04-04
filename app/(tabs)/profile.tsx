import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
  SafeAreaView,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface MenuItem {
  icon: string;
  title: string;
  onPress: () => void;
  badge?: string;
}

export default function Profile() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleMenuPress = (route: string) => {
    try {
      // @ts-ignore
      router.push(route);
    } catch (error) {
      console.error('Navigation error:', error);
      Alert.alert(
        'Error',
        'Unable to navigate to the selected screen. Please try again.'
      );
    }
  };

  const renderMenuItem = ({ icon, title, onPress, badge }: MenuItem) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuItemLeft}>
        <Ionicons name={icon as any} size={24} color="#000" />
        <Text style={styles.menuItemTitle}>{title}</Text>
      </View>
      <View style={styles.menuItemRight}>
        {badge && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        )}
        <Ionicons name="chevron-forward" size={20} color="#999" />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen
        options={{
          headerTitle: 'Profile',
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
      <ScrollView 
        style={styles.container} 
        bounces={false}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 16,
        }}
      >
        <View style={styles.header}>
          <Image
            source={{ uri: 'https://i.imgur.com/YZqoKkX.jpg' }}
            style={styles.profileImage}
          />
          <Text style={styles.name}>Efe Bakır</Text>
          <Text style={styles.email}>efebakir@gmail.com</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Activity</Text>
          {renderMenuItem({
            icon: 'time-outline',
            title: 'Orders',
            onPress: () => {},
          })}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          {renderMenuItem({
            icon: 'notifications-outline',
            title: 'Notifications',
            onPress: () => {},
          })}
          {renderMenuItem({
            icon: 'language-outline',
            title: 'Language',
            onPress: () => {},
          })}
          {renderMenuItem({
            icon: 'moon-outline',
            title: 'Dark Mode',
            onPress: () => {},
          })}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Help & Info</Text>
          {renderMenuItem({
            icon: 'help-circle-outline',
            title: 'Help Center',
            onPress: () => {},
          })}
          {renderMenuItem({
            icon: 'mail-outline',
            title: 'Contact Us',
            onPress: () => {},
          })}
          {renderMenuItem({
            icon: 'information-circle-outline',
            title: 'About',
            onPress: () => {},
          })}
        </View>

        <View style={styles.version}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
      </ScrollView>
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
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chevronContainer: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItemTitle: {
    fontSize: 16,
    color: '#1a1a1a',
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  menuItemValue: {
    fontSize: 14,
    color: '#666',
  },
  version: {
    padding: 24,
    alignItems: 'center',
  },
  versionText: {
    fontSize: 14,
    color: '#999',
  },
  badge: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
}); 