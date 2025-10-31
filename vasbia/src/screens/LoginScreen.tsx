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
  const [showPassword, setShowPassword] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  return (
    <View style={styles.container}>
      {errorMessage && <ToastError toastMessage={errorMessage} onHide={() => setErrorMessage(null)} />}
      {successMessage && <ToastSuccess toastMessage={successMessage} onHide={() => setErrorMessage(null)} />}

      <View style={styles.infoContainer}>
        <Text style={styles.title}>VASBIA</Text>
        <Text style={styles.subtitle}>Welcome Back !</Text>
        <Text style={styles.description}>Enter your username and password to sign in.</Text>

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

        <View style={{position: 'relative'}}>
          <TextInput
            style={styles.inputText}
            onChangeText={setPassword}
            value={password}
            placeholder="Password"
            secureTextEntry={!showPassword}
            placeholderTextColor={'gray'}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              right: 52,
              top: 0,
              height: 40,
              justifyContent: 'center',
            }}
          >
            <Text style={{
              color: "#828282",
              fontFamily: 'Inter_24pt-SemiBold',
              fontSize: 12,
            }}>
              {showPassword ? 'Hide' : 'Show'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* ============================ login API =============================== */}
        <TouchableOpacity style={styles.button} onPress={async () => {
          var encodedEmail = encodeURIComponent(email);
          var encodedPassword = encodeURIComponent(password);

          if (email === '' || password === '') {
            setErrorMessage('Please enter both email and password.');
            return;
          }

          await fetch(`${Config.BASE_API_URL}/api/auth/login?email=${encodedEmail}&password=${encodedPassword}`, {method: 'POST'})
            .then(response => response.json())
            .then((res) => {
              CookieManager.clearAll();

              console.log('Login response:', res);
              
              if (res.message != 'Login Success!!') {
                setErrorMessage('Invalid email or password.');
                return;
              }
            
              CookieManager.set(`${Config.BASE_API_URL}`, {
                name: 'token',
                value: res.data,
                domain: `${(Config.BASE_API_URL)?.replace('https://', '')}`,
                path: '/',
                version: '1',
                // expires: '2030-12-31T23:59:59.00-00:00',
              });
            })
            .catch((error) => {
              console.error('Error:', error);
              setErrorMessage('An error occurred. Please try again..');
              // Handle any errors that occurred during the request
            });

            const cookies = await CookieManager.get(`${Config.BASE_API_URL}`);
            console.log('Cookies after login:', cookies['token'].value);
            
            if (cookies['token'] === undefined) {
              setErrorMessage('Invalid email or password.');
              return;
            }
            
          setSuccessMessage('Login successful!');
          navigation.replace('Map');

          }}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>

        
        <TouchableOpacity onPress={() => navigation.replace('Register')}>
          <Text style={styles.suggestText}>Don't have an account?</Text>
        </TouchableOpacity>
      </View>
      {/* ============================ login API =============================== */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    // justifyContent: 'center',
    paddingHorizontal: 16,
  },
  infoContainer: {
    marginTop: '50%',
    width: '100%',
  },
  inputText:{
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