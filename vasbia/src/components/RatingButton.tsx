import { TouchableOpacity, StyleSheet } from "react-native";
import RatingBIcon from "../assets/icons/RatingBIcon";

type ButtonProps = {
  onPressButton?: () => void;   
};

export default function RatingButton({ onPressButton }: ButtonProps) {
  return (
    <TouchableOpacity onPress={onPressButton} activeOpacity={0.8} style={ [styles.button] }>
      <RatingBIcon />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    
  },
});