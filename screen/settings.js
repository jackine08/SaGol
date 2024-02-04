import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import CheckBox from 'react-native-check-box';
import RNFS from 'react-native-fs';

function Page_setting() {
  const [subdirectories, setSubdirectories] = useState([]);

  useEffect(() => {
    const listSubdirectories = async () => {
      try {
        const externalPath = RNFS.ExternalStorageDirectoryPath;
        const directories = await RNFS.readDir(externalPath);

        const subdirectoryPaths = await Promise.all(
          directories
            .filter((dir) => dir.isDirectory())
            .map(async (dir) => {
              const hasImages = await checkSubdirectoryImages(dir.path);
              return { path: dir.path, checked: false, hasImages };
            })
        );

        setSubdirectories(subdirectoryPaths);
      } catch (error) {
        console.error('Error reading subdirectories:', error);
      }
    };

    listSubdirectories();
  }, []);

  const checkSubdirectoryImages = async (dirPath) => {
    const files = await RNFS.readDir(dirPath);
    return files.some((file) => file.isFile() && file.name.match(/\.(jpg|jpeg|png|gif)$/i));
  };

  const handleCheckboxToggle = (path) => {
    const updatedSubdirectories = [...subdirectories];
    const targetIndex = updatedSubdirectories.findIndex((directory) => directory.path === path);

    if (targetIndex !== -1) {
      updatedSubdirectories[targetIndex].checked = !updatedSubdirectories[targetIndex].checked;
      setSubdirectories(updatedSubdirectories);
    }
  };

  return (
    <View>
      {subdirectories
        .filter((directory) => directory.hasImages)
        .map((directory) => (
          <CheckBox
            key={directory.path}
            style={{ padding: 10 }}
            isChecked={directory.checked}
            rightText={directory.path}
            onClick={() => handleCheckboxToggle(directory.path)}
          />
        ))}
      <Text>Checked Directories:</Text>
      {subdirectories
        .filter((directory) => directory.checked)
        .map((checkedDirectory) => (
          <Text key={checkedDirectory.path}>{checkedDirectory.path}</Text>
        ))}
    </View>
  );
}

export default Page_setting;
