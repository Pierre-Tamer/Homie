import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAuthStore } from '../store/auth.store';
import { AuthStackParamList } from '../types';
import HomeScreen from '../screens/home';
import PhoneNumberScreen from '../screens/auth/PhoneNumber';
import CreateProfileScreen from '../screens/auth/createProfile';
import ConfirmMailScreen from '../screens/auth/confirmEmail';
import ContactModal from '../components/home/contactModal';
import CreateListing from '../screens/createListing';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthNavigator() {
  const isSignedIn = useAuthStore((state) => state.isSignedIn);
  const isCompleteProfile = useAuthStore((state) => state.isCompleteProfile);
  const isVerified = useAuthStore((state) => state.isVerified);
  // const isSignedIn = true;
  // const isCompleteProfile = true;
  console.log(isSignedIn, isCompleteProfile);

  if (isSignedIn && isCompleteProfile && isVerified) {
    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Group>
          <Stack.Screen name="Root" component={HomeScreen} />
          <Stack.Screen name="createListing" component={CreateListing} />
        </Stack.Group>
        <Stack.Group screenOptions={{ presentation: 'modal' }}>
          <Stack.Screen name="contactModal" component={ContactModal} />
        </Stack.Group>
      </Stack.Navigator>
    );
  }

  if (isSignedIn && !isCompleteProfile && isVerified) {
    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="createProfile" component={CreateProfileScreen} />
      </Stack.Navigator>
    );
  }

  if (isSignedIn && !isVerified) {
    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="verify" component={ConfirmMailScreen} />
      </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="phoneNumber" component={PhoneNumberScreen} />
    </Stack.Navigator>
  );
}
