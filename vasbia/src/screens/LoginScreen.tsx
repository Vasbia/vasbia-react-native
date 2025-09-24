import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { StackParamList } from '../../App';

type LoginScreenNavigationProp = NativeStackNavigationProp<StackParamList, 'Login'>;

export default function LoginScreen() {
  const navigation = useNavigation<LoginScreenNavigationProp>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vusbia</Text>
      <Text style={styles.subtitle}>welcome !</Text>
      <Text style={styles.description}>login with your Google account.</Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.replace('Map')}>
        <Text style={styles.buttonText}>Sign in with Google</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    marginBottom: 4,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    marginBottom: 40,
    textAlign: 'center',
    color: '#555',
  },
  button: {
    backgroundColor: '#4285F4', 
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 6,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
