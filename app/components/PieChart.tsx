// PieChartComponent.tsx
import React from 'react';
import PieChart from 'react-native-pie-chart';
import { View, StyleSheet, Text } from 'react-native';

interface PieChartComponentProps {
    widthAndHeight: number;
    series: number[];
    sliceColor: string[];
}

const PieChartComponent: React.FC<PieChartComponentProps> = ({ widthAndHeight, series, sliceColor }) => {

    const labels = ['Application Submitted', 'OA Received', 'OA Completed', 'Interview', 'Rejected', 'Offer'];

    return (
        <View style={styles.chartContainer}>
            <PieChart
                widthAndHeight={widthAndHeight}
                series={series}
                sliceColor={sliceColor}
                coverRadius={0.6}
                coverFill={'#25292e'}
            />

            <View style={styles.legendContainer}>
                {labels.map((label, index) => (
                    <View key={index} style={styles.legendItem}>
                        <View style={[styles.colorBox, { backgroundColor: sliceColor[index] }]} />
                        <Text style={styles.legendText}>{label}</Text>

                    </View>
                ))}
            </View>
        </View>
    );
};

export default PieChartComponent;

const styles = StyleSheet.create({
    chartContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 200, // Adjust as needed to position the chart properly
    },
    legendContainer: {
        marginTop: 20,
        flexDirection: 'column', // Stack the legend items vertically
        alignItems: 'center',
      },
      legendItem: {
        flexDirection: 'row', // Display color box and label in a row
        alignItems: 'center',
        marginBottom: 5, // Spacing between legend items
      },
      colorBox: {
        width: 15,
        height: 15,
        marginRight: 10, // Spacing between the color box and the text
      },
      legendText: {
        color: '#fff',
        fontSize: 14,
      },
      
});
