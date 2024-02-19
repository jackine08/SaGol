import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Voice from '@react-native-voice/voice';
import { LogBox } from 'react-native';

LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message
LogBox.ignoreAllLogs(); // Ignore all log notifications

const SearchBestImages = ({ navigation }) => {
  // State 정의
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [tfMatrix, setTFMatrix] = useState([]);

  // useEffect를 활용한 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const keys = await AsyncStorage.getAllKeys();
        const items = await AsyncStorage.multiGet(keys);
        const tokenizedItems = items.map(([key, value]) => ({
          key,
          tokens: tokenize(JSON.parse(value)["en"]),
        }));
        setTFMatrix(tokenizedItems);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // 텍스트 토큰화 함수
  const tokenize = (text) => {
    const cleanedText = text.toLowerCase().replace(/[.,]/g, '');
    return cleanedText.split(' ');
  };

  // 쿼리 핸들링 함수
  const handleQuery = async (queryToUse, tfMatrixToUse) => {
    if (!queryToUse || queryToUse.trim() === '') {
      setResults(['Query is empty']);
      return;
    }
  
    try {
      const translationResponse = await axios.post('http://minigpt4.hcailab.uos.ac.kr/translate', {
        query: queryToUse
      });
  
      const queryTokens = tokenize(translationResponse.data);
  
      // TF Matrix 정렬 및 결과 설정
      const sortedResults = tfMatrixToUse.map((item) => ({
        key: item.key,
        similarity: calculateSimilarity(queryTokens, item.tokens),
      })).sort((a, b) => b.similarity - a.similarity);
  
      // 유사도가 0인 결과를 필터링
      const filteredResults = sortedResults.filter(result => result.similarity > 0);
      console.log(filteredResults);
      const topResults = filteredResults.map(result => result.key);
      console.log(topResults);
      navigation.navigate('Page_Results', { results: topResults });
    } catch (error) {
      console.error('Error querying server:', error);
      Alert.alert('서버 오류', '서버에서 응답을 가져오는 중 오류가 발생했습니다.');
    }
  };
  

  // 유사도 계산 함수
  const calculateSimilarity = (queryTokens, itemTokens) => {
    const commonTokens = itemTokens.filter((token) => queryTokens.includes(token));
    return commonTokens.length / Math.sqrt(queryTokens.length * itemTokens.length);
  };

  // 음성 입력 토글 함수
  const toggleSpeechRecognition = async () => {
    try {
      if (isListening) {
        await Voice.stop();
      } else {
        await Voice.start('en-EN');
      }
      setIsListening(!isListening);
    } catch (error) {
      console.error('Error toggling speech recognition:', error);
      Alert.alert('음성 입력 오류', '음성 입력을 시작 또는 종료하는 중 오류가 발생했습니다.');
    }
  };

  // 음성 입력 결과 처리 함수
  const onSpeechResults = async (event) => {
    if (event.value && event.value.length > 0) {
      try {
        setQuery(event.value[0]);
        const keys = await AsyncStorage.getAllKeys();
        const items = await AsyncStorage.multiGet(keys);
        const tokenizedItems = items.map(([key, value]) => ({
          key,
          tokens: tokenize(JSON.parse(value)["en"]),
        }));
        confirmQuery(event.value[0], tokenizedItems);
      } catch (error) {
        console.error('Error speech result', error);
        Alert.alert('음성 입력 오류', '음성 입력을 시작 또는 종료하는 중 오류가 발생했습니다.');
      }
    }
  };

  // 음성 입력 오류 처리 함수
  const onSpeechError = (event) => {
    console.error('Speech recognition error:', event.error);
    Alert.alert('음성 인식 오류', '음성 인식 중 오류가 발생했습니다.');
  };

  // 음성 입력 종료 처리 함수
  const onSpeechEnd = () => {
    setIsListening(false);
  };

  // 검색어 확인 및 검색 함수
  const confirmQuery = (spokenQuery, tf) => {
    Alert.alert(
      'Keyword Confirm',
      `Typed Keyword: ${spokenQuery}`,
      [
        {
          text: 'NO',
          style: 'cancel',
        },
        {
          text: 'YES',
          onPress: () => handleQuery(spokenQuery, tf),
        },
      ],
      { cancelable: false }
    );
  };

  // useEffect를 활용한 Voice 모듈 설정 및 정리
  useEffect(() => {
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechEnd = onSpeechEnd;

    return () => {
      Voice.destroy().then(() => {
        Voice.removeAllListeners('onSpeechResults');
        Voice.removeAllListeners('onSpeechError');
        Voice.removeAllListeners('onSpeechEnd');
      });
    };
  }, []);

  // 렌더링
  return (
    <View>
      <Button
        title={isListening ? 'Voice Recognition End' : 'Voice Recognition Start'}
        accessibilityLabel="Voice Recognition Button. After the voice recognition, this app shows the result of search."
        onPress={toggleSpeechRecognition}
      />
      <TextInput
        style={styles.input}
        placeholder="Type a Keyword or Phrase"
        value={query}
        onChangeText={(text) => setQuery(text)}
      />
      <Button title="Search" accessibilityLabel="Search Button, this app search the images." onPress={() => handleQuery(query, tfMatrix)} />
    </View>
  );
};

// 스타일 정의
const styles = StyleSheet.create({
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 8,
  },
});

export default SearchBestImages;
