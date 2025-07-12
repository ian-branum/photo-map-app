import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabaseClient';

export default function AuthScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'signIn' | 'signUp'>('signIn');
  const router = useRouter();

  async function handleAuth() {
    setLoading(true);
    let result;
    if (mode === 'signIn') {
      result = await supabase.auth.signInWithPassword({ email, password });
    } else {
      result = await supabase.auth.signUp({ email, password });
    }
    setLoading(false);
    if (result.error) {
      Alert.alert('Error', result.error.message);
    } else if (result.data.session || result.data.user) {
      router.replace('/(tabs)');
    } else if (mode === 'signUp') {
      Alert.alert('Check your email', 'Please confirm your email address.');
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{mode === 'signIn' ? 'Sign In' : 'Sign Up'}</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title={loading ? 'Loading...' : mode === 'signIn' ? 'Sign In' : 'Sign Up'} onPress={handleAuth} disabled={loading} />
      <Text style={styles.switchText} onPress={() => setMode(mode === 'signIn' ? 'signUp' : 'signIn')}>
        {mode === 'signIn' ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  input: {
    width: '100%',
    maxWidth: 320,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  switchText: {
    marginTop: 16,
    color: '#2f95dc',
    textDecorationLine: 'underline',
    fontSize: 16,
  },
}); 