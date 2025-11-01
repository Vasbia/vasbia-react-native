import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Platform,
  TouchableOpacity,
} from 'react-native';
import Svg, { G, Path, Rect, Defs, ClipPath } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { StackParamList } from '../../App';   // adjust if path differs

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
  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();

  return (
    <View style={[{ width: 385, height: 72, justifyContent: 'center' } as ViewStyle, style]}>
      <Svg width={385} height={72} fill="none" style={StyleSheet.absoluteFill} {...props}>
        <G filter="url(#a)">
          <Path
            fill="#F3EDF7"
            d="M4 12C4 5.373 9.373 0 16 0h353c6.627 0 12 5.373 12 12v40c0 6.627-5.373 12-12 12H16C9.373 64 4 58.627 4 52V12Z"
          />
          <G clipPath="url(#b)">
            <Path
              fill="#49454F"
              d="m39.6 41-6.3-6.3a6.096 6.096 0 0 1-3.8 1.3c-1.817 0-3.354-.63-4.613-1.888C23.63 32.854 23 31.317 23 29.5c0-1.817.63-3.354 1.887-4.613C26.146 23.63 27.683 23 29.5 23c1.817 0 3.354.63 4.612 1.887C35.371 26.146 36 27.683 36 29.5a6.096 6.096 0 0 1-1.3 3.8l6.3 6.3-1.4 1.4Zm-10.1-7c1.25 0 2.313-.438 3.188-1.313C33.562 31.814 34 30.75 34 29.5c0-1.25-.438-2.313-1.313-3.188C31.814 25.438 30.75 25 29.5 25c-1.25 0-2.313.438-3.188 1.313S25 28.25 25 29.5c0 1.25.438 2.313 1.313 3.188C27.188 33.562 28.25 34 29.5 34Z"
            />
          </G>
        </G>
        <Defs>
          <ClipPath id="b">
            <Rect width={40} height={40} x={12} y={12} fill="#fff" rx={20} />
          </ClipPath>
          <ClipPath id="c">
            <Rect width={56} height={56} x={309} y={4} fill="#fff" rx={16} />
          </ClipPath>
          <ClipPath id="e">
            <Rect width={56} height={56} x={309} y={4} fill="#fff" rx={16} />
          </ClipPath>
        </Defs>
      </Svg>

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
    left: 56,
    right: 70,
    height: 40,
    top: 16,
    fontSize: 18,
    color: '#222',
    backgroundColor: 'transparent',
    paddingLeft: 8,
    paddingRight: 8,
    borderRadius: 8,
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      default: 'Inter',
    }),
  },
});

export default SearchBar;