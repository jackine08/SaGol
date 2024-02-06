import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { getItem } from './storage';

const { width } = Dimensions.get('window');
const itemWidth = width * 0.35; // 화면 너비의 40%

function ImageItem({ navigation, path, name }) {
  const [description, setDescription] = useState("");

  useEffect(() => {
    const fetchDescription = async () => {
      try {
        const storedDescription = await getItem(path);

        // Check if storedDescription is empty or not a valid JSON string
        const parsedDescription = storedDescription
          ? JSON.parse(storedDescription)["ko"]
          : "설명 없음";

        setDescription(parsedDescription);
      } catch (error) {
        console.error("Error fetching description:", error);
      }
    };

    fetchDescription();
  }, [name]);

  return (
    <TouchableOpacity onPress={() => navigation.navigate('Page_imageDescription', { path, description, name })}>
      <View style={styles.itemContainer}>
        <Image source={{ uri: path }} style={styles.image} accessibilityLabel={description} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 5,
    margin: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  image: {
    width: itemWidth,
    height: itemWidth, // 가로세로 동일하게 설정하여 정사각형으로 유지
    borderRadius: 25,
    resizeMode: 'cover', // 이미지의 크기를 늘리고, 가로세로 비율을 유지하며 표시
  },
});

export default ImageItem;
