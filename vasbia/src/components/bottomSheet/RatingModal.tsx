import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Rating } from 'react-native-ratings';
import BottomSheet from './BottomSheet';

import CookieManager from '@react-native-cookies/cookies';
import Config from 'react-native-config';

const { width: screenWidth } = Dimensions.get('window');

type RatingModalProps = {
  visible: boolean;
  onClose: () => void;
};

export default function RatingModal({ visible, onClose }: RatingModalProps) {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');

  const handleSubmit = async () => {
    try {
      const cookies = await CookieManager.get(`${Config.BASE_API_URL}`);
      console.log('Submitting feedback with token:', cookies.token?.value);
      const response = await fetch(`${Config.BASE_API_URL}/api/feedback-application?rating=${rating}&comment=${feedback}&token=${cookies.token?.value}`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.status);
      }
      const data = await response.json();
      console.log('Feedback submitted successfully:', data);
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
    onClose();
    setFeedback('');
    setRating(0);
  };

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <Text style={styles.modalTitle}>How do you rate our application?</Text>
      <Rating
        imageSize={36}
        startingValue={rating}
        onFinishRating={setRating}
        style={styles.rating}
        tintColor="#ffffff"
        ratingColor="#fbb405"
        ratingBackgroundColor="#eeeeee"
        type="custom"
      />
      <Text style={styles.feedbackLabel}>Tell us more (optional)</Text>
      <TextInput
        style={styles.feedbackInput}
        placeholder="Please comment here..."
        placeholderTextColor="#828282"
        value={feedback}
        onChangeText={setFeedback}
        multiline
        numberOfLines={8}
      />
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  modalTitle: {
    fontSize: 24,
    fontFamily: 'Inter_24pt-SemiBold',
    marginBottom: 16,
    color: '#000',
    maxWidth: screenWidth * 0.7,
    alignSelf: 'center',
    textAlign: 'center',
  },
  rating: {
    marginBottom: 16,
    color: '#000',
  },
  feedbackLabel: {
    alignSelf: 'flex-start',
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  feedbackInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#303030',
    color: '#000',
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
    marginBottom: 10,
    fontFamily: 'Inter_24pt-Regular',
    fontSize: 12,
    minHeight: 60,
    textAlignVertical: 'top',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  submitButton: {
    backgroundColor: '#2d6eff',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 24,
    marginTop: 8,
    alignItems: 'center',
    width: '100%',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Inter_24pt-SemiBold',
    backgroundColor: 'transparent',
  },
});
