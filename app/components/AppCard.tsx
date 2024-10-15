// This will be for the cards that appear on history

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type AppCardProps = {
  name: string;
  position: string;
  date: Date;
  status: string;
};

export default function AppCard({ name, position, date, status }: AppCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{name}</Text>
      <Text style={styles.cardText}>Position: {position}</Text>
      <Text style={styles.cardText}>Date: {new Date(date).toLocaleDateString()}</Text>
      <Text style={styles.cardText}>Status: {status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#464C55',
    borderRadius: 8,
    marginVertical: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  cardText: {
    fontSize: 16,
    color: '#fff',
    marginVertical: 5,
  },
});
