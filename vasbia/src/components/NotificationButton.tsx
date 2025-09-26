import { TouchableOpacity, StyleSheet } from "react-native";
import NotificationBIcon from "../assets/icons/NotificationBIcon";

type ButtonProps = {
  onPressButton?: () => void;   
};

export default function NotificationButton({ onPressButton }: ButtonProps) {
  return (
    <TouchableOpacity onPress={onPressButton} activeOpacity={0.8} style={ [styles.button] }>
      <NotificationBIcon />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    
  },
});