import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { Rating } from "react-native-ratings";
import BottomSheet from "./BottomSheet";

const { width: screenWidth } = Dimensions.get("window");

type RatingModalProps = {
  visible: boolean;
  onClose: () => void;
};

export default function RatingModal({ visible, onClose }: RatingModalProps) {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  const handleSubmit = () => {
    console.log("Submitted rating:", rating, feedback);
    setFeedback("");
    setRating(0);
    onClose();
  };

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <Text style={styles.modalTitle}>How do you rate our application?</Text>
      <Rating
        imageSize={36}
        startingValue={rating}
        onFinishRating={setRating}
        style={styles.rating}
        tintColor="#353638"
        ratingColor="#ccd"
        ratingBackgroundColor="#fff"
        type="custom"
      />
      <Text style={styles.feedbackLabel}>Tell us more (optional)</Text>
      <TextInput
        style={styles.feedbackInput}
        placeholder="Please comment here..."
        placeholderTextColor="#fff"
        value={feedback}
        onChangeText={setFeedback}
        multiline
        numberOfLines={8}
      />
      <TouchableOpacity style={styles.submitButtonBlack} onPress={handleSubmit}>
        <Text style={styles.submitButtonTextWhite}>Submit</Text>
      </TouchableOpacity>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#fff',
    maxWidth: screenWidth * 0.7,
    alignSelf: 'center',
    textAlign: 'center',
  },
  rating: {
    marginBottom: 16,
    color: '#fff',
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
    borderColor: '#fff',
    color: '#fff',
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
    marginBottom: 10,
    fontSize: 16,
    minHeight: 60,
    textAlignVertical: 'top',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  submitButtonBlack: {
    backgroundColor: '#000',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 24,
    marginTop: 8,
    alignItems: 'center',
    width: '100%',
  },
  submitButtonTextWhite: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    backgroundColor: 'transparent',
  },
});
