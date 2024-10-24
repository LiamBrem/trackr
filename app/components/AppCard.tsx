import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';  // For 3-dot icon

type AppCardProps = {
  name: string;
  position: string;
  date: Date;
  status: string;
  onEdit: () => void;
  onDelete: () => void;
};

const statusColorMap: { [key: string]: string } = {
  'Application Submitted': '#47CAFA', // Light Blue
  'OA Received': '#4177E1',           // Medium Blue
  'OA Completed': '#2952B4',          // Dark Blue
  'Interview': '#002A8C',             // Navy Blue
  'Rejected': '#DF3F64',              // Red
  'Offer': '#81EE9E',                 // Green
  'Unknown': '#ccc'                   // Default gray for unknown status
};

export default function AppCard({
  name,
  position,
  date,
  status,
  onEdit,
  onDelete,
}: AppCardProps) {
  const statusColor = statusColorMap[status] || statusColorMap['Unknown'];

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{name}</Text>
        <TouchableOpacity onPress={() => {
          Alert.alert(
            "Actions",
            "Choose an action",
            [
              { text: "Edit", onPress: onEdit },
              { text: "Delete", onPress: onDelete },
              { text: "Cancel", style: "cancel" }
            ]
          );
        }}>
          <MaterialIcons name="more-vert" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <Text style={styles.cardText}>Position: {position}</Text>
      <Text style={styles.cardText}>Date: {new Date(date).toLocaleDateString()}</Text>
      <View style={styles.statusContainer}>
        <View style={[styles.statusSquare, { backgroundColor: statusColor }]} />
        <Text style={styles.cardText}>Status: {status}</Text>
      </View>
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusSquare: {
    width: 15,
    height: 15,
    marginRight: 10, // Adds space between the square and text
    borderRadius: 2, // Optional, to make the square slightly rounded
  },
});
