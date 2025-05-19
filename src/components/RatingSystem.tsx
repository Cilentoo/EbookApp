import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface RatingSystemProps {
  initialValue?: number;
  readonly?: boolean;
  onRatingChange?: (rating: number) => void;
  size?: 'small' | 'medium' | 'large';
}

const RatingSystem: React.FC<RatingSystemProps> = ({
  initialValue = 0,
  readonly = false,
  onRatingChange,
  size = 'medium',
}) => {
  const [rating, setRating] = useState(initialValue);
  
  const handleRating = (value: number) => {
    if (readonly) return;
    
    setRating(value);
    if (onRatingChange) {
      onRatingChange(value);
    }
  };
  
  const getStarSize = () => {
    switch (size) {
      case 'small': return 16;
      case 'large': return 30;
      default: return 24;
    }
  };
  
  const starSize = getStarSize();
  
  return (
    <View style={styles.container}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity
          key={star}
          onPress={() => handleRating(star)}
          disabled={readonly}
          style={styles.starContainer}
        >
          <Ionicons
            name={rating >= star ? 'star' : 'star-outline'}
            size={starSize}
            color={rating >= star ? '#FF9529' : '#CCCCCC'}
          />
        </TouchableOpacity>
      ))}
      
      {rating > 0 && (
        <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  starContainer: {
    padding: 2,
  },
  ratingText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF9529',
  },
});

export default RatingSystem;