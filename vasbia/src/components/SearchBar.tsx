import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
// import Svg, { G, Path, Rect, Defs, ClipPath } from 'react-native-svg';
import SearchBarSvg from '../assets/icons/SearchBarSvg';
// import { useNavigation } from '@react-navigation/native';
// import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import type { StackParamList } from '../../App';   // adjust if path differs

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onSubmit?: (text: string) => void;  // ✅ New prop
  style?: ViewStyle;
  inputStyle?: TextStyle;
  [key: string]: any;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder,
  onSubmit, // ✅ receive callback
  style,
  inputStyle,
  ...props
}) => {
  // const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();

  return (
    <View style={[{justifyContent: 'center' } as ViewStyle, style]}>
      <View style={styles.searchBar}>
        <SearchBarSvg />
      </View>

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        style={[styles.input, inputStyle]}
        placeholderTextColor="#888"
        autoCorrect={false}
        autoComplete="off"
        importantForAutofill="no"
        onSubmitEditing={() => {        // ✅ handle Enter key
          if (onSubmit && value.trim()) {
            onSubmit(value.trim());
          }
        }}
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    position: 'absolute',
    left: 44,
    fontSize: 16,
    color: '#222',
    backgroundColor: 'transparent',
    borderRadius: 8,
    fontFamily: 'Inter_24pt-Regular',
  },
  searchBar:{
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    backgroundColor: '#fff',
    borderRadius: 8,
  }
});

export default SearchBar;