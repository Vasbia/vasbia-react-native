import { TouchableOpacity, StyleSheet } from "react-native";
import SuggestionBIcon from "../assets/icons/SuggestionBIcon";

type ButtonProps = {
  onPressButton?: () => void;   
};

export default function SuggestionButton({ onPressButton }: ButtonProps) {
  return (
    <TouchableOpacity onPress={onPressButton} activeOpacity={0.8} style={ [styles.button] }>
      <SuggestionBIcon />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    
  },
});