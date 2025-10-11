import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { StackParamList } from '../../App';
import { useState } from 'react';
import CookieManager from '@react-native-cookies/cookies';
import Config from 'react-native-config';
import ToastError from '../components/ToastError';
import ToastSuccess from '../components/ToastSuccess';

type LoginScreenNavigationProp = NativeStackNavigationProp<StackParamList, 'Login'>;

export default function LoginScreen() {
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  return (
    <View style={styles.container}>
      {errorMessage && <ToastError toastMessage={errorMessage} onHide={() => setErrorMessage(null)} />}
      {successMessage && <ToastSuccess toastMessage={successMessage} onHide={() => setErrorMessage(null)} />}
      
      <Text style={styles.title}>Vusbia</Text>
      <Text style={styles.subtitle}>welcome !</Text>
      <Text style={styles.description}>login with your imagination.</Text>

      <TextInput
        style={{ height: 40, width: '50%', borderColor: 'gray', borderWidth: 1, borderRadius: 5, marginTop: 20, paddingHorizontal: 10, color: 'black' }}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        onChangeText={setEmail}
        value={email}
        placeholder="Email"
        placeholderTextColor={'gray'}
      />

      <TextInput
        style={{ height: 40, width: '50%', borderColor: 'gray', borderWidth: 1, borderRadius: 5, marginTop: 20, paddingHorizontal: 10, color: 'black' }}
        onChangeText={setPassword}
        value={password}
        placeholder="Password"
        secureTextEntry={true}
        placeholderTextColor={'gray'}
      />

      {/* ============================ login API =============================== */}
      <TouchableOpacity style={styles.button} onPress={async () => {
        var encodedEmail = encodeURIComponent(email);
        var encodedPassword = encodeURIComponent(password);

        if (email === '' || password === '') {
          setErrorMessage("Please enter both email and password.");
          return;
        }

        await fetch(`${Config.BASE_API_URL}/api/auth/login?email=${encodedEmail}&password=${encodedPassword}`, {method: 'POST'})
          .then(response => response.json())
          .then((res) => {
            CookieManager.clearAll();
            
            if (res.status != 200) {
              setErrorMessage("Invalid email or password.");
              return;
            }

          
            CookieManager.set(`${Config.BASE_API_URL}`, {
              name: 'token',
              value: res.token,
              domain: `${(Config.BASE_API_URL)?.replace('https://', '')}`,
              path: '/',
              version: '1',
              // expires: '2030-12-31T23:59:59.00-00:00',
            });
          })
          .catch((error) => {
            console.error('Error:', error);
            setErrorMessage("An error occurred. Please try again..");
            // Handle any errors that occurred during the request
          });

          const cookies = await CookieManager.get(`${Config.BASE_API_URL}`);
          console.log('Cookies after login:', cookies["token"].value);
          
          if (cookies["token"] === undefined) {
            setErrorMessage("Invalid email or password.");
            return;
          }
          
        setSuccessMessage("Login successful!");
        navigation.replace('Map');

        }}>
        <Text style={styles.buttonText}>Sign in</Text>
      </TouchableOpacity>
      {/* ============================ login API =============================== */}
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
    color: '#555'
  },
  subtitle: {
    fontSize: 20,
    marginBottom: 4,
    textAlign: 'center',
    color: '#555'
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
    margin: 30,
    borderRadius: 6,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
