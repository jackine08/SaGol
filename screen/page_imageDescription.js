import React from 'react';
import { Button, SafeAreaView, Text, View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Share from 'react-native-share';
import RNFS from 'react-native-fs'; // Import the react-native-fs library
import { removeItem } from '../component/storage'; // Assuming you have a removeItem function in your storage module

function Page_imageDescription({ route, navigation }) {
  const { path, description, name } = route.params;

  const shareImage = async () => {
    try {
      const shareOptions = {
        title: 'Share Image',
        message: 'Check out this image!',
        url: path,
      };
      await Share.open(shareOptions);
    } catch (error) {
      console.error('Error sharing image:', error.message);
    }
  };

  const handleDelete = async () => {
    try {
      // Remove the item from storage
      await removeItem(path);
  
      // Delete the actual image file from the device
      await RNFS.unlink(path);
  
      // You might want to add additional logic here to navigate back or perform other actions after deletion
      navigation.goBack(); // Navigate back to the previous screen after deletion
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };
  

  return (
    <SafeAreaView>
      <Image
        source={{ uri: path }}
        style={styles.image}
        resizeMode="cover" // 이미지의 크기를 늘리고, 가로세로 비율을 유지하며 표시
      />
      <View>
        <Button
          title="이미지 공유하기"
          onPress={shareImage}
        />
        <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
          <Text style={styles.deleteButtonText}>이미지 삭제</Text>
        </TouchableOpacity>
        <Text>사진 설명: {description}</Text>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  image: {
    height: undefined,
    width: undefined,
    aspectRatio: 1, // 가로세로 비율을 1:1로 유지
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  deleteButtonText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default Page_imageDescription;
