import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { StackParamList } from '../../App';
import { useState } from 'react';
import Config from 'react-native-config';
import ToastError from '../components/ToastError';
import ToastSuccess from '../components/ToastSuccess';

type LoginScreenNavigationProp = NativeStackNavigationProp<StackParamList, 'Login'>;

export default function RegisterScreen() {
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleRegister = async () => {
    if (!firstName || !lastName || !email || !password) {
      setErrorMessage('Please fill in all fields.');
      return;
    }

    try {
      const response = await fetch(
        `${Config.BASE_API_URL}/api/auth/createUser?fname=${encodeURIComponent(firstName)}&lname=${encodeURIComponent(lastName)}&email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}&role=USER&key=%2B%3Dh%2B%5Daq%5E%29Vd%3BEh4mr%5Df%5EvGgmgh%3Ck-7`,
        { method: 'POST' }
      );

      const res = await response.json();
      console.log('Register response:', res);

      if (!res.email || !res.fname || !res.lname) {
        setErrorMessage('Registration failed. Please try again.');
        return;
      }

      setSuccessMessage('Register successful!');
      setTimeout(() => {
        navigation.replace('Login');
      }, 1200);
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('An error occurred. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      {errorMessage && <ToastError toastMessage={errorMessage} onHide={() => setErrorMessage(null)} />}
      {successMessage && <ToastSuccess toastMessage={successMessage} onHide={() => setSuccessMessage(null)} />}

      <View style={styles.infoContainer}>
        <Text style={styles.title}>VASBIA</Text>
        <Text style={styles.subtitle}>Create an account</Text>
        <Text style={styles.description}>Enter your information to sign up.</Text>

        <TextInput
          style={styles.inputText}
          onChangeText={setFirstName}
          value={firstName}
          placeholder="First Name"
          placeholderTextColor={'gray'}
        />

        <TextInput
          style={styles.inputText}
          onChangeText={setLastName}
          value={lastName}
          placeholder="Last Name"
          placeholderTextColor={'gray'}
        />

        <TextInput
          style={styles.inputText}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={setEmail}
          value={email}
          placeholder="Email"
          placeholderTextColor={'gray'}
        />

        <TextInput
          style={styles.inputText}
          onChangeText={setPassword}
          value={password}
          placeholder="Password"
          secureTextEntry={true}
          placeholderTextColor={'gray'}
        />

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Sign up</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.replace('Login')}>
          <Text style={styles.suggestText}>Already have an account?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  infoContainer: {
    marginTop: '45%',
    width: '100%',
  },
  inputText: {
    height: 40,
    width: '80%',
    marginLeft: 32,
    marginRight: 32,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 12,
    fontFamily: 'Inter_24pt-Regular',
    fontSize: 14,
    textAlign: 'left',
    color: 'black',
  },
  title: {
    fontSize: 40,
    fontFamily: 'Inter_24pt-SemiBold',
    marginBottom: 8,
    textAlign: 'center',
    color: '#000',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter_24pt-SemiBold',
    marginBottom: 4,
    textAlign: 'center',
    color: '#555',
  },
  description: {
    fontSize: 12,
    fontFamily: 'Inter_24pt-Regular',
    marginBottom: 24,
    textAlign: 'center',
    color: '#555',
  },
  button: {
    backgroundColor: '#4285F4',
    width: '80%',
    marginTop: 8,
    marginLeft: '10%',
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 6,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'Inter_24pt-Medium',
  },
  suggestText: {
    color: '#828282',
    fontSize: 12,
    fontFamily: 'Inter_24pt-Regular',
    textAlign: 'right',
    marginRight: '10%',
    marginTop: 16,
    textDecorationLine: 'underline',
  },
});
