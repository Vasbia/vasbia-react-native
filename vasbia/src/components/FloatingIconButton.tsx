import { TouchableOpacity, StyleSheet, ViewStyle } from "react-native";

type FloatingIconButtonProps = {
  icon: React.ReactNode;          
  onPress?: () => void;   
  style?: ViewStyle | ViewStyle[];         
};

export default function FloatingIconButton({ icon, onPress, style }: FloatingIconButtonProps) {
  return (
    <TouchableOpacity 
      onPress={onPress} 
      activeOpacity={0.8} 
      style={[styles.button, style]} // merge default + custom styles
    >
      {icon}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingBottom: 7,
  },
});
