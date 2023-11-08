import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text } from 'react-native';
import { supabase } from './utils/supabase';
import Dashboard from './components/Dashboard';
import Auth from './src/Auth';
import ChooseRoleScreen from './components/ChooseRoleScreen';
import ForgotPassword from './src/ForgotPassword';

const Stack = createStackNavigator();

export default function App() {
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isLoading ? (
          <Stack.Screen name="Loading" component={LoadingScreen} options={{ headerShown: false }} />
        ) : session && session.user ? (
          <Stack.Screen name="Dashboard" component={Dashboard} options={{ headerShown: false }} />
        ) : (
          <>
            <Stack.Screen
              name="ChooseRole"
              component={ChooseRoleScreen}
              options={{ title: 'Choose Role', headerShown: false }} // Hide the header
            />
            <Stack.Screen
              name="Login"
              component={Auth}
              initialParams={{ action: 'login' }}
            />
            <Stack.Screen
              name="SignUp"
              component={Auth}
              initialParams={{ action: 'signup' }}
            />
            <Stack.Screen 
              name="ForgotPassword" 
              component={ForgotPassword} 
              initialParams={{ action: 'forgotpassword' }}
              />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function LoadingScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Loading...</Text>
    </View>
  );
}
