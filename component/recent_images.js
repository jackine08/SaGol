import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Dimensions } from 'react-native';
import get_picture_data from "./GalleryPicker";
import { getItem } from './storage';
import ImageItem from './image_item';

const { width } = Dimensions.get('window');
const itemWidth = (width - 48) / 2; // 화면 너비에서 여백을 빼고 2로 나눈 값

const RecentImagesGridView = ({ navigation }) => {
  const [localData, setLocalData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await get_picture_data();
        setLocalData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={localData}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => <ImageItem path={"file://" + item.path} name={item.name} navigation={navigation} />}
        numColumns={2}
        contentContainerStyle={styles.flatListContainer}
        columnWrapperStyle={styles.columnWrapper}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 0, // 여백을 0으로 설정
  },
  flatListContainer: {
    justifyContent: 'space-between',
    marginHorizontal: 16, // 좌우 여백 추가
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginVertical: 8,
  },
});

export default RecentImagesGridView;
