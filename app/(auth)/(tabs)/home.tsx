import { View, Text, Button, StyleSheet } from 'react-native';
import auth from '@react-native-firebase/auth';
import { Link } from 'expo-router';


const Page = () => {
    const user = auth().currentUser; // access current user


    return (
        <View style={styles.container}>
            <Text style={styles.text}>Welcome back {user?.email}</Text>
            <Button title="Sign out" onPress={() => auth().signOut()} />

            <Link href="/(auth)/history" style={styles.button}>
                Go to history page
            </Link>
        </View>
    );
};
export default Page;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#25292e',
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: {
      color: '#fff',
    },
    button: {
      fontSize: 20,
      textDecorationLine: 'underline',
      color: '#fff',
    },
  });