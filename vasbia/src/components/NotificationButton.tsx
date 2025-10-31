import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import NotificationBIcon from "../assets/icons/NotificationBIcon";

type ButtonProps = {
  onPressButton?: () => void;
  badgeCount?: number;
};

export default function NotificationButton({ onPressButton, badgeCount = 0 }: ButtonProps) {
  return (
    <TouchableOpacity onPress={onPressButton} activeOpacity={0.8} style={{}}>
      <NotificationBIcon />
      {badgeCount > 0 &&  badgeCount < 10 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badgeCount}</Text>
        </View>
      )}
      {badgeCount >= 10 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>9+</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    zIndex: 10,
  },
  badgeText: {
    color: '#fff',
    fontFamily: 'Inter_24pt-Regular',
    fontSize: 12,
  },
});