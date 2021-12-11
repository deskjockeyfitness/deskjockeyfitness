import React, { useState } from 'react'
import { Alert, StyleSheet, View, Button, TextInput } from 'react-native'
import { supabase } from '../lib/initSupabase'

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState('')

  const handleLogin = async (type: string, email: string, password: string) => {
    setLoading(type)
    const { error, user } =
      type === 'LOGIN'
        ? await supabase.auth.signIn({ email, password })
        : await supabase.auth.signUp({ email, password })
    if (!error && !user) Alert.alert('Check your email for the login link!')
    if (error) Alert.alert(error.message)
    setLoading('')
  }

  return (
    <View>
      <View>
        <TextInput
          onChangeText={setEmail}
          value={email}
          placeholder="Email address"
        />
      </View>
      <View>
        <TextInput
          onChangeText={setPassword}
          value={password}
          placeholder="Password"
        />
      </View>
      <View>
        <Button
          title="Sign in"
          disabled={!!loading.length || !email || !password}
          onPress={() => handleLogin('LOGIN', email, password)}
        />
      </View>
      <View>
        <Button
          title="Sign up"
          disabled={!!loading.length || !email || !password}
          onPress={() => handleLogin('SIGNUP', email, password)}
        />
      </View>
    </View>
  )
}
