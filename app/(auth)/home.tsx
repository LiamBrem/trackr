import { View, Text, Button } from 'react-native';
import auth from '@react-native-firebase/auth';


const Page = () => {
    const user = auth().currentUser; // access current user


    return (
        <View>
            <Text>Welcome back {user?.email}</Text>
            <Button title="Sign out" onPress={() => auth().signOut()} />
        </View>
    );
};
export default Page;