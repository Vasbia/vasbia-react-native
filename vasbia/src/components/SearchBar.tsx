
import React from 'react';
import { TouchableHighlight} from 'react-native';
import { StyleSheet } from 'react-native';
import SearchBarSvg from '../assets/icons/SearchBarSvg';

type ButtonProps = {
  onPressButton?: () => void;
};

export default function SearchBar({ onPressButton }: ButtonProps) {
  return (
    <TouchableHighlight onPress={onPressButton} style={ [styles.searchbar] }>
      <SearchBarSvg />
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  searchbar: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
});