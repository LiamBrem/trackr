import { Text, View, StyleSheet, Pressable, ScrollView, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

import AddNew from '@/app/components/AddNew';
import AppCard from '@/app/components/AppCard';

type Application = {
  id: string;
  name: string;
  position: string;
  date: Date;
  status: string;
};

export default function History() {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null); 

  const currentUserUID = auth().currentUser?.uid;

  // Fetch applications from Firestore with real-time listener
  useEffect(() => {
    const userId = currentUserUID;

    // Attach a snapshot listener to Firestore
    const unsubscribe = firestore()
      .collection('users')
      .doc(userId)
      .collection('applications')
      .orderBy('date', 'desc')  // Ensure they're ordered by date
      .onSnapshot((querySnapshot) => {
        const fetchedApplications: Application[] = querySnapshot.docs.map(doc => {
          const data = doc.data();
          const date = new Date(data.date);  // Convert the date string to a Date object
          return {
            id: doc.id,
            name: data.name,
            position: data.position,
            date: date,
            status: data.status,
          };
        });

        setApplications(fetchedApplications);  // Update state with new data
      });

    // Cleanup the listener when component unmounts or user logs out
    return () => unsubscribe();
  }, [currentUserUID]);  // The listener will trigger when currentUserUID changes

  // Add a new application to Firestore
  const handleAddNewApplication = async (newApplication: Application) => {
    try {
      const userId = currentUserUID;

      // Add the new application to Firestore
      await firestore()
        .collection('users')
        .doc(userId)
        .collection('applications')
        .add({
          ...newApplication,
          date: firestore.FieldValue.serverTimestamp(), // Store as a Firebase Timestamp
        });

      // Close the modal after submission
      setIsModalVisible(false);

    } catch (error) {
      console.log("Error adding new application:", error);
    }
  };

    // Handle editing an application (open modal with data)
    const handleEdit = (application: Application) => {
      setSelectedApp(application);
      setIsModalVisible(true);
    };
  
    // Handle deleting an application
    const handleDelete = (id: string) => {
      Alert.alert(
        "Delete Application",
        "Are you sure you want to delete this application?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            onPress: async () => {
              try {
                await firestore()
                  .collection('users')
                  .doc(currentUserUID)
                  .collection('applications')
                  .doc(id)
                  .delete();
              } catch (error) {
                console.log("Error deleting application:", error);
              }
            }
          }
        ]
      );
    };

  const onAddSticker = () => {
    setIsModalVisible(true);
  };

  const onModalClose = () => {
    setIsModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>History</Text>

      <ScrollView style={styles.cardsContainer}>
        {applications.map((application, index) => (
          <AppCard
            key={index}
            name={application.name}
            position={application.position}
            date={application.date}
            status={application.status}
            onEdit={() => handleEdit(application)}
            onDelete={() => handleDelete(application.id)}
          />
        ))}
      </ScrollView>

      <Pressable style={styles.button} onPress={onAddSticker}>
        <Text style={styles.text}>ADD NEW</Text>
      </Pressable>

      <AddNew
        isVisible={isModalVisible}
        onClose={onModalClose}
        onSubmit={handleAddNewApplication}
      />
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
    position: 'absolute',
    bottom: 20,
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: '#007AFF',
  },
  cardsContainer: {
    width: '100%',
    marginBottom: 80,
    paddingHorizontal: 10,
  },
});
