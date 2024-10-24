import { Text, View, StyleSheet, Pressable, ScrollView, Alert, TextInput } from 'react-native';
import { useState, useEffect } from 'react';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

import AddNew from '@/app/components/AddNew';
import AppCard from '@/app/components/AppCard';
import { SafeAreaView } from 'react-native-safe-area-context';

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
  const [searchQuery, setSearchQuery] = useState<string>('');
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

      if (selectedApp) {
        // Update existing application
        await firestore()
          .collection('users')
          .doc(userId)
          .collection('applications')
          .doc(selectedApp.id)
          .update({
            ...newApplication,
            date: firestore.FieldValue.serverTimestamp(),
          });
      } else {
        // Add new application
        await firestore()
          .collection('users')
          .doc(userId)
          .collection('applications')
          .add({
            ...newApplication,
            date: firestore.FieldValue.serverTimestamp(),
          });
      }
      // Close the modal after submission
      setIsModalVisible(false);
      setSelectedApp(null);  // Reset selected app

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

  const filteredApplications = applications.filter(app =>
    app.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        {/* Search Bar */}
        <TextInput
          style={styles.searchBar}
          placeholder="Search by company name"
          placeholderTextColor="#aaa"
          value={searchQuery}
          onChangeText={text => setSearchQuery(text)}
        />

        <ScrollView style={styles.cardsContainer}>
          {filteredApplications.map((application, index) => (
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
          application={selectedApp}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#25292e',
  },
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
    bottom: 0,
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
    marginBottom: 70,
    paddingHorizontal: 10,
  },
  searchBar: {
    width: '90%',
    height: 40,
    borderRadius: 8,
    backgroundColor: '#333',
    color: '#fff',
    paddingHorizontal: 10,
    marginVertical: 10,
  },
});
