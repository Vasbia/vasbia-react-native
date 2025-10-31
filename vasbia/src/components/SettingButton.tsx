import { TouchableOpacity, StyleSheet } from 'react-native';
import SettingIcon from '../assets/icons/SettingIcon';

type ButtonProps = {
  onPressButton?: () => void;
};

export default function RatingButton({ onPressButton }: ButtonProps) {
  return (
    <TouchableOpacity onPress={onPressButton} activeOpacity={0.8} style={ [styles.button] }>
      <SettingIcon />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {

  },
});
