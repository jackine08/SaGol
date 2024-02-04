import React from 'react';
import { SafeAreaView, StatusBar, TouchableOpacity, Text } from 'react-native';
import ShowPicker from '../component/image_picker';
import RecentImagesGridView from '../component/recent_images';
import SearchBestImages from '../component/search_best_images';

function PageMain({ navigation }) {
  return (
    <SafeAreaView>
      <StatusBar />
      <SearchBestImages navigation={navigation} />
      <ShowPicker />
      <RecentImagesGridView navigation={navigation} />
    </SafeAreaView>
  );
}


export default PageMain;
