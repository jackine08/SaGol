import RNFS from 'react-native-fs';
import { PermissionsAndroid } from 'react-native';

async function get_picture_data(folderPath = RNFS.ExternalStorageDirectoryPath) {
  console.log(folderPath);
  const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES);

  const result = [];

  if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    try {
      const files = await RNFS.readDir(folderPath);

      // 정렬: 최신 수정일자 순서로
      files.sort((a, b) => b.mtime.getTime() - a.mtime.getTime());

      for (const file of files) {
        if (file.isFile() && file.name.match(/\.(jpg|jpeg|png|gif)$/i)) {
          // 파일이 이미지인 경우
          result.push({
            path: file.path,
            name: file.name,
            mtime: file.mtime, // 이미지의 마지막 수정 날짜 추가
          });
        } else if (file.isDirectory()) {
          // 폴더인 경우 해당 폴더 안의 이미지를 찾아서 추가 (재귀 호출)
          console.log(file.path);
          const subfolderImages = await get_picture_data(file.path);
          result.push(...subfolderImages);
        }
      }

      return result;
    } catch (error) {
      console.error(`Error reading folder ${folderPath}:`, error);
      return result; // 에러 발생 시 빈 배열을 반환
    }
  } else {
    console.log('Permission denied to access external storage');
    return result; // 권한이 거부된 경우 빈 배열을 반환
  }
}

export default get_picture_data;
