import { Text, View, StyleSheet, Button, Pressable } from 'react-native';
import { Link, router } from "expo-router";
import { useState } from 'react';

import AddNew from '@/app/components/AddNew';


export default function History() {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const onAddSticker = () => {
    setIsModalVisible(true);
  };

  const onModalClose = () => {
    setIsModalVisible(false);
  };


  return (
    <View style={styles.container}>
      <Text style={styles.text}>History</Text>
      <Pressable style={styles.button} onPress={onAddSticker}>
        <Text style={styles.text}>ADD NEW</Text>
      </Pressable>
      <AddNew isVisible={isModalVisible} onClose={onModalClose}>
        {/* A list of emoji component will go here */}
      </AddNew>
    </View>
  );
}

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
    position: 'absolute',  // Position the button at the bottom
    bottom: 20,  // 20px from the bottom
    width: '80%',  // Make the button take up 80% of the screen width
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: '#007AFF',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  }
});
