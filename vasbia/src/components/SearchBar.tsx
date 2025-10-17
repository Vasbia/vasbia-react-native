import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import SearchBarSvg from '../assets/icons/SearchBarSvg';

type ButtonProps = {
  onPressButton?: () => void;
};

export default function SearchBar({ onPressButton }: ButtonProps) {
  return (
    <TouchableOpacity onPress={onPressButton} style={styles.searchbar} activeOpacity={0.7}>
      <SearchBarSvg />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  searchbar: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
