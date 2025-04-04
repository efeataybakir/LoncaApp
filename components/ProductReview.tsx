import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  userImage?: string;
}

interface ProductReviewProps {
  rating: number;
  totalReviews: number;
  reviews: Review[];
  onSeeAllPress: () => void;
}

export function ProductReview({
  rating,
  totalReviews,
  reviews,
  onSeeAllPress,
}: ProductReviewProps) {
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= rating ? 'star' : 'star-outline'}
          size={16}
          color={i <= rating ? '#FFB800' : '#666'}
        />
      );
    }
    return stars;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Customer Reviews</Text>
        <TouchableOpacity onPress={onSeeAllPress}>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.ratingContainer}>
        <View style={styles.ratingHeader}>
          <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
          <View style={styles.starsContainer}>
            {renderStars(Math.round(rating))}
          </View>
        </View>
        <Text style={styles.totalReviews}>Based on {totalReviews} reviews</Text>
      </View>

      <View style={styles.reviewsList}>
        {reviews.map((review) => (
          <View key={review.id} style={styles.reviewItem}>
            <View style={styles.reviewHeader}>
              {review.userImage ? (
                <Image
                  source={{ uri: review.userImage }}
                  style={styles.userImage}
                />
              ) : (
                <View style={styles.userInitial}>
                  <Text style={styles.initialText}>
                    {review.userName.charAt(0)}
                  </Text>
                </View>
              )}
              <View style={styles.reviewHeaderText}>
                <Text style={styles.userName}>{review.userName}</Text>
                <View style={styles.starsContainer}>
                  {renderStars(review.rating)}
                </View>
              </View>
              <Text style={styles.reviewDate}>{review.date}</Text>
            </View>
            <Text style={styles.reviewComment}>{review.comment}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  seeAll: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  ratingContainer: {
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  ratingHeader: {
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 36,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  totalReviews: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  reviewsList: {
    gap: 16,
  },
  reviewItem: {
    gap: 12,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  userInitial: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  initialText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  reviewHeaderText: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  reviewDate: {
    fontSize: 12,
    color: '#666',
  },
  reviewComment: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
}); 