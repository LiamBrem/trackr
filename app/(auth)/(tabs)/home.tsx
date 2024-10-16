import { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import PieChartComponent from '@/app/components/PieChart';


const Page = () => {
  const [totalApplications, setTotalApplications] = useState<number>(0);
  const [offersCount, setOffersCount] = useState<number>(0);
  const [statusCounts, setStatusCounts] = useState<{ [key: string]: number }>({
    'Application Submitted': 0,
    'OA Received': 0,
    'OA Completed': 0,
    'Interview': 0,
    'Rejected': 0,
    'Offer': 0,
  });
  const [loading, setLoading] = useState<boolean>(true); // New loading state

  const user = auth().currentUser;

  // Animated values
  const fadeAnimLeft = useRef(new Animated.Value(0)).current;
  const fadeAnimRight = useRef(new Animated.Value(0)).current;
  const translateYLeft = useRef(new Animated.Value(30)).current;
  const translateYRight = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    if (user) {
      const userId = user.uid;

      // Fetch total applications and count offers
      const unsubscribe = firestore()
        .collection('users')
        .doc(userId)
        .collection('applications')
        .onSnapshot((querySnapshot) => {
          const applications = querySnapshot.docs.map(doc => doc.data());

          const statusCounter: { [key: string]: number } = {
            'Application Submitted': 0,
            'OA Received': 0,
            'OA Completed': 0,
            'Interview': 0,
            'Rejected': 0,
            'Offer': 0,
          };

          applications.forEach((app) => {
            const status = app.status || 'Unknown';  // Handle if status is undefined
            if (statusCounter[status] !== undefined) {
              statusCounter[status] += 1;
            }
          });

          //const offers = applications.filter(app => app.status.toLowerCase() === 'offer');

          setTotalApplications(applications.length);
          setOffersCount(statusCounter['Offer']);
          setStatusCounts(statusCounter);
          setLoading(false);
        });

      return () => unsubscribe();
    }
  }, [user]);

  // Animation effect on mount
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnimLeft, {
        toValue: 1,
        duration: 600,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnimRight, {
        toValue: 1,
        duration: 600,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(translateYLeft, {
        toValue: 0,
        duration: 600,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(translateYRight, {
        toValue: 0,
        duration: 600,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const widthAndHeight = 250;
  const series = Object.values(statusCounts);
  const sliceColor = ['#fbd203', '#ffb300', '#ff9100', '#ff6c00', '#ff3c00', '#98FB98'];
  const isDataAvailable = series.reduce((a, b) => a + b, 0) > 0;


  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>Dashboard</Text>

      <Animated.View
        style={[
          styles.card,
          styles.cardLeft,
          { opacity: fadeAnimLeft, transform: [{ translateY: translateYLeft }] },
        ]}
      >
        <Text style={styles.cardText}>Total Applications</Text>
        <Text style={styles.statValue}>{totalApplications}</Text>
      </Animated.View>

      <Animated.View
        style={[
          styles.card,
          styles.cardRight,
          { opacity: fadeAnimRight, transform: [{ translateY: translateYRight }] },
        ]}
      >
        <Text style={styles.cardText}>Offers Received</Text>
        <Text style={styles.statValue}>{offersCount}</Text>
      </Animated.View>
      {loading ? (
        <Text style={styles.loadingText}>Loading...</Text>  // Loading state
      ) : isDataAvailable ? (
        <PieChartComponent 
          widthAndHeight={widthAndHeight}
          series={series}
          sliceColor={sliceColor}
        />
      ) : (
        <Text style={styles.noDataText}>No data available to display</Text>  // Fallback if no data
      )}
    </View>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    justifyContent: 'flex-start', // Align items from the top
    paddingTop: 50, // Space for the dashboard title
  },
  pageTitle: {
    color: '#fff',
    fontSize: 26, // Increased font size for the dashboard title
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  card: {
    width: '40%', // Ensure both cards are equal in width
    height: 150, // Set equal height for both cards
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#464C55', // Card background color
    position: 'absolute',
    elevation: 5,
    justifyContent: 'center', // Center text vertically
    alignItems: 'center', // Center text horizontally
  },
  cardLeft: {
    top: 100,
    left: 20,
  },
  cardRight: {
    top: 100,
    right: 20,
  },
  cardText: {
    color: '#fff',
    fontSize: 18, // Increased font size for card text
    marginBottom: 10,
    textAlign: 'center',
  },
  statValue: {
    color: '#fff',
    fontSize: 28, // Larger stat value font size for emphasis
    fontWeight: 'bold',
    textAlign: 'center',
  },
  chartContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 200, // Adjust as needed to position the chart properly
  },
  loadingText: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 50,
  },
  noDataText: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 50,
  },
});
