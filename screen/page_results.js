import React, { useState } from 'react';
import { SafeAreaView, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ImageItem from '../component/image_item';
import { useNavigation } from '@react-navigation/native';
import RNFS from 'react-native-fs';

const DateFilterDropdown = ({ onSelect, selectedOption }) => {
  const options = ['All','Today', 'Past week', 'Past month', 'Past year'];
  const [showOptions, setShowOptions] = useState(false);

  return (
    <View style={styles.dropdownContainer}>
      <TouchableOpacity style={styles.dropdownHeader} onPress={() => setShowOptions(!showOptions)}>
        <Text>{selectedOption}</Text>
      </TouchableOpacity>
      {showOptions && (
        <View style={styles.dropdownOptions}>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.dropdownOption}
              onPress={() => {
                onSelect(option);
                setShowOptions(false);
              }}
            >
              <Text>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

function Page_Results({ route }) {
  const initialData = route.params.results;
  const [filteredData, setFilteredData] = useState(initialData);
  const navigation = useNavigation(); // useNavigation 훅 사용
  const [selectedFilter, setSelectedFilter] = useState('All');

  const filterDataByDate = (filter) => {
    const currentDate = new Date();
    let filteredResults = initialData;
    initialData.filter(item => console.log(item));

    if (filter !== 'All') {
      filteredResults = initialData.filter(item => isWithinDays(new Date(), currentDate, getDays(filter)));
    }

    setFilteredData(filteredResults);
    setSelectedFilter(filter);
  };

  
  const isWithinDays = (date1, date2, days) => {
    const timeDifference = date2.getTime() - date1.getTime();
    const daysDifference = timeDifference / (1000 * 3600 * 24);
    return daysDifference <= days;
  };

  const getDays = (filter) => {
    switch (filter) {
      case 'Today':
        return 0;
      case 'Past week':
        return 7;
      case 'Past month':
        return 30;
      case 'Past year':
        return 365;
      default:
        return 0;
    }
  };

  return (
    <SafeAreaView style={{ flexDirection: 'row', flex: 1 }}>
      <View style={{ flex: 1 }}>
        <Text style={styles.resultsText}>Search Result Count: {filteredData.length}</Text>
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item}
          renderItem={({ item }) => <ImageItem path={item} name={item} navigation={navigation} />}
          numColumns={2}
          contentContainerStyle={styles.flatListContainer}
        />
      </View>
      <View style={styles.filterContainer}>
        <DateFilterDropdown onSelect={filterDataByDate} selectedOption={selectedFilter} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  resultsText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    marginLeft: 16,
  },
  flatListContainer: {
    paddingHorizontal: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  dropdownContainer: {
    position: 'relative',
  },
  dropdownHeader: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  dropdownOptions: {
    position: 'absolute',
    top: 30,
    right: 0,
    width: 150,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    zIndex: 1,
  },
  dropdownOption: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
});

export default Page_Results;
