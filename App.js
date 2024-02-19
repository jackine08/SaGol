import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
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
          headerTitleAlign: 'center', // 헤더 타이틀을 화면 중앙에 배치합니다.
          headerTitleContainerStyle: {
            left: 0, // 좌우 정중앙
            right: 0, // 좌우 정중앙
            top: 0, // 상하 정중앙
            bottom: 0, // 상하 정중앙
          },
        }}
      >
        <Stack.Screen
          name="Page_Main"
          component={Page_Main}
          options={() => ({  
            title: '사골',
            headerTitleAlign: 'center',
            // headerRight: SettingsButton,
          })}
        />
        <Stack.Screen
          name="Page_imageDescription"
          component={Page_imageDescription}
          options={{ title: '이미지 설명' ,
          headerAccessibilityLabel: '뒤로 가기'}}
        />
        <Stack.Screen
          name="Page_Results"
          component={Page_Results}
          options={{ title: '검색 결과',
          headerAccessibilityLabel: '뒤로 가기'}}
          
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

// 설정 버튼을 렌더링하는 별도의 함수
const SettingsButton = () => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={{ padding: 10, marginRight: 10 }}
      onPress={() => {
        if (navigation) {
          navigation.navigate("Page_setting");
        }
      }}
    >
      <Text>설정</Text>
    </TouchableOpacity>
  );
};

const App = () => {
  return ( 
    <Navigation />
  );
};

export default App;
