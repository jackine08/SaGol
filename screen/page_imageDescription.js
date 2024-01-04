import React from 'react';
import { Button, SafeAreaView, Text, View, Alert, Image } from 'react-native';
import Share from 'react-native-share';

function Page_imageDescription({ route }) {
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

  return (
    <SafeAreaView>
      <Image
        source={{ uri: path }}
        style={{ width: 200, height: 200 }} // 이미지 크기 설정 (선택 사항)
      />
      <View>
        <Text>사진 설명: {description}</Text>
        <Button
          title="이미지 공유하기"
          onPress={shareImage}
        />
      </View>
    </SafeAreaView>
  );
}

export default Page_imageDescription;
