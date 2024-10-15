import { Text, View, StyleSheet, Button } from 'react-native';
import { Link } from 'expo-router';
import auth from '@react-native-firebase/auth';

export default function History() {
  return (
    <View style={styles.container}>
      <View style={styles.container}>
            <Button title="Sign out" onPress={() => auth().signOut()} />
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
  },
});
