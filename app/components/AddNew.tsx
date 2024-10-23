import { Modal, View, Text, Pressable, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { PropsWithChildren } from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useState, useEffect } from 'react';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth'; // Import Firebase Authentication

type Application = {
  id: string;
  name: string;
  position: string;
  date: Date;  // Make sure to use the correct type for date
  status: string;
};

type Props = PropsWithChildren<{
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (newApplication: Application) => Promise<void>; // Add onSubmit here
}>;


export default function AddNew({ isVisible, children, onClose, onSubmit }: Props) {
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [date, setDate] = useState(new Date());
  const [status, setStatus] = useState<string>(''); // State for selected dropdown option
  const [showDropdown, setShowDropdown] = useState(false);

  // Reset the form when the modal visibility changes
  useEffect(() => {
    if (!isVisible) {
      setName('');
      setPosition('');
      setStatus('');
      setDate(new Date()); // Reset the date field to current date
    }
  }, [isVisible]);

  const handleDateChange = (event: any, selectedDate: Date | undefined) => {
    setShowDropdown(false);
    if (selectedDate) setDate(selectedDate);
  };

  const handleSubmit = async () => {
    if (!name || !position || !status) {
      alert('Please fill in all fields!');
      return;
    }

    console.log('Name:', name);
    console.log('Position:', position);
    console.log('Date:', date.toString());  // Convert date to string
    console.log('Status:', status); // Log the selected status

    // Get the current authenticated user's UID
    const currentUserUID = auth().currentUser?.uid;

    if (!currentUserUID) {
      alert('User not authenticated!');
      return;
    }

    try {
      // Add the new application data to Firestore under the user's UID
      await firestore()
        .collection('users')  // 'users' collection
        .doc(currentUserUID)  // document for the current user
        .collection('applications')  // 'applications' sub-collection
        .add({  // Add a new document
          name: name,
          position: position,
          date: date.toString(),
          status: status,
        });

      alert('Application Added!');

    } catch (error) {
      console.error('Error adding application to Firestore:', error);
      alert('Failed to add application!');
    }

    onClose(); // Close modal after submitting
  };

  return (
    <Modal animationType="slide" transparent={true} visible={isVisible}>
      <View style={styles.modalContent}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Add New Application</Text>
          <Pressable onPress={onClose}>
            <MaterialIcons name="close" color="#fff" size={22} />
          </Pressable>
        </View>
        <View style={styles.formContainer}>
          <Text style={styles.labelText}>Company</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Name"
            value={name}
            onChangeText={setName}
          />
          <Text style={styles.labelText}>Position</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Position"
            value={position}
            onChangeText={setPosition}
          />
          <Text style={styles.labelText}>Date</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Date"
            value={date.toString()}  // Display date as string
            onChangeText={(text) => setDate(new Date(text))}
          />
          <Text style={styles.labelText}>Status</Text>
          <Pressable style={styles.dropdownButton} onPress={() => setShowDropdown(!showDropdown)}>
            <Text style={styles.dropdownText}>{status || 'Select Status'}</Text>
          </Pressable>

          {showDropdown && (
            <View style={styles.dropdownMenu}>
              <TouchableOpacity onPress={() => setStatus('Application Submitted')}>
                <Text style={[styles.dropdownOption, { backgroundColor: '#47CAFA' }]}>Application Submitted</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setStatus('OA Received')}>
                <Text style={[styles.dropdownOption, { backgroundColor: '#4177E1' }]}>OA Received</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setStatus('OA Completed')}>
                <Text style={[styles.dropdownOption, { backgroundColor: '#2952B4' }]}>OA Completed</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setStatus('Interview')}>
                <Text style={[styles.dropdownOption, { backgroundColor: '#002A8C' }]}>Interview</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setStatus('Rejected')}>
                <Text style={[styles.dropdownOption, { backgroundColor: '#DF3F64' }]}>Rejected</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setStatus('Offer')}>
                <Text style={[styles.dropdownOption, { backgroundColor: '#81EE9E' }]}>Offer</Text>
              </TouchableOpacity>
            </View>
          )}

          <Pressable style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContent: {
    height: '93%',
    width: '100%',
    backgroundColor: '#25292e',
    borderTopRightRadius: 18,
    borderTopLeftRadius: 18,
    position: 'absolute',
    bottom: 0,
  },
  titleContainer: {
    height: '5%',
    backgroundColor: '#464C55',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: '#fff',
    fontSize: 16,
  },
  formContainer: {
    padding: 20,
    flex: 1,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    color: '#fff',
    backgroundColor: '#464C55',
    borderRadius: 5,
  },
  dropdownButton: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: '#464C55',
    borderRadius: 5,
  },
  dropdownText: {
    color: '#fff',
    fontSize: 16,
  },
  dropdownMenu: {
    backgroundColor: '#464C55',
    borderRadius: 5,
    paddingVertical: 10,
  },
  dropdownOption: {
    padding: 10,
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  labelText: {
    color: '#fff',
    fontSize: 18,  // Slightly bigger font size
    marginBottom: 5,
  },
});
