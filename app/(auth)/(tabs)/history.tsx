import { Text, View, StyleSheet } from 'react-native';
import { Link } from "expo-router";

export default function History() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>History screen</Text>
      <Link href="/(auth)/(tabs)/settings" style={styles.link}>
        Open modal
      </Link>
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
  link: {
    paddingTop: 20,
    fontSize: 20,
  },
});
