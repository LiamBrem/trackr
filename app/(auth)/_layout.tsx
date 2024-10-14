import { Stack, Link } from 'expo-router';
import { View, Text } from 'react-native';

const Layout = () => {
    return (
        <Stack>
            <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
        </Stack>
    )
    
}


export default Layout;