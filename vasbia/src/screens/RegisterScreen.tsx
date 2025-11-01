import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { StackParamList } from '../../App';
import { useState } from 'react';
import Config from 'react-native-config';
import ToastError from '../components/ToastError';
import ToastSuccess from '../components/ToastSuccess';
import RadioGroup, {RadioButtonProps} from 'react-native-radio-buttons-group';

type LoginScreenNavigationProp = NativeStackNavigationProp<StackParamList, 'Login'>;

export default function RegisterScreen() {
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [confirmedPassword, setConfirmedPassword] = useState('');
  const [showConfirmedPassword, setShowConfirmedPassword] = useState(false);
  const [selectedId, setSelectedId] = useState<string>();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const radioButtons: RadioButtonProps[] = useMemo(() => ([
        {
            id: 'USER',
            label: 'User',
            value: 'USER',
            labelStyle: styles.roleText,
        },
        {
            id: 'BUS_DRIVER',
            label: 'Bus Driver',
            value: 'BUS_DRIVER',
            labelStyle: styles.roleText,
        },
    ]), []);

  // const payload = {
  //   fname: firstName,
  //   lname: lastName,
  //   email,
  //   password,
  //   role: selectedId,
  // };

  const handleRegister = async () => {
    if (!firstName || !lastName || !email || !password || !confirmedPassword || !selectedId) {
      setErrorMessage('Please fill in all fields and select a role.');
      return;
    }

    if (password !== confirmedPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    // console.log('URL:', `${Config.BASE_API_URL}/api/auth/createUser?...`)
    console.log('payload:', firstName, lastName, email, password, selectedId);
    try {
      const response = await fetch(
        `${Config.BASE_API_URL}/api/auth/register?fname=${encodeURIComponent(firstName)}&lname=${encodeURIComponent(lastName)}&email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}&role=${encodeURIComponent(selectedId ?? '')}&key=${Config.API_KEY}`,
        { method: 'POST' }
      );

      const res = await response.json();
      console.log('Register response:', res);

      if (!res.email || !res.fname || !res.lname) {
        setErrorMessage(res.message || 'Registration failed. Please try again.');
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
              color: '#828282',
              fontFamily: 'Inter_24pt-SemiBold',
              fontSize: 12,
            }}>
              {showPassword ? 'Hide' : 'Show'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{position: 'relative'}}>
          <TextInput
            style={styles.inputText}
            onChangeText={setConfirmedPassword}
            value={confirmedPassword}
            placeholder="Confirmed Password"
            secureTextEntry={!showConfirmedPassword}
            placeholderTextColor={'gray'}
          />
          <TouchableOpacity
            onPress={() => setShowConfirmedPassword(!showConfirmedPassword)}
            style={{
              position: 'absolute',
              right: 52,
              top: 0,
              height: 40,
              justifyContent: 'center',
            }}
          >
            <Text style={{
              color: '#828282',
              fontFamily: 'Inter_24pt-SemiBold',
              fontSize: 12,
            }}>
              {showConfirmedPassword ? 'Hide' : 'Show'}
            </Text>
          </TouchableOpacity>
        </View>

        <View/>
          <Text style={styles.roleTitleText}>Select Role</Text>
          <RadioGroup
              radioButtons={radioButtons}
              onPress={setSelectedId}
              selectedId={selectedId}
              containerStyle={styles.radioContainer}
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
  radioContainer: {
    flexDirection: 'row',
    // justifyContent: 'space-around',
    alignItems: 'center',
    textShadowColor: 'black',
    marginLeft: 28,
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
  roleText: {
    color: 'black',
    fontSize: 14,
    fontFamily: 'Inter_24pt-Regular',
  },
  roleTitleText:{
    color: 'black',
    fontSize: 16,
    fontFamily: 'Inter_24pt-SemiBold',
    marginLeft: 32,
  },
});
