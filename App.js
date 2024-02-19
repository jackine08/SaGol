import React from 'react';
import { TouchableOpacity, Image } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Page_Main from './screen/main';
import Page_imageDescription from './screen/page_imageDescription';
import Page_Results from './screen/page_results';
import Page_setting from './screen/settings';

const Stack = createNativeStackNavigator();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerTitleAlign: 'center',
          headerTitleContainerStyle: {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
          },
        }}
      >
        <Stack.Screen
          name="Page_Main"
          component={Page_Main}
          options={() => ({
            title: '사골',
            headerTitleAlign: 'center',
          })}
        />
        <Stack.Screen
          name="Page_imageDescription"
          component={Page_imageDescription}
          options={{ 
            title: '이미지 설명',
            headerLeft: () => <BackButton />, }}
        />
        <Stack.Screen
          name="Page_Results"
          component={Page_Results}
          options={{ 
            title: '검색 결과',
            headerLeft: () => <BackButton />,}}
        />
        <Stack.Screen
          name="Page_setting"
          component={Page_setting}
          options={{ title: '설정' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const backButtonImage = require('./assets/back-icon.png');

// 뒤로가기 버튼을 렌더링하는 함수
const BackButton = () => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={{ padding: 10, marginLeft: 10 }}
      onPress={() => {
        if (navigation) {
          navigation.goBack();
        }
      }}
      accessibilityLabel="뒤로 가기"
    >
      <Image
        source={backButtonImage}
        style={{ width: 20, height: 20 }}  // 이미지의 크기를 조절하거나 스타일을 필요에 따라 수정하세요.
      />
    </TouchableOpacity>
  );
};

const App = () => {
  return (
    <Navigation />
  );
};

export default App;
