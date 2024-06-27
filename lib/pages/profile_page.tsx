import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Alert } from "react-native";
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProfileScreenNavigationProp } from "./types";
import videoFace from '../assets/video-face.png';
import stylesProfile from "../styles/profile_page_styles";
import styles from "../styles/home_page_styles";
import resonateFaceBackground from '../assets/resonate-background.png';
import info from '../assets/icon/about-icon.png';
import phoneIcon from '../assets/icon/phone-icon.png';
import mailIcon from '../assets/icon/mail-icon.png';

type Props = {
  navigation: ProfileScreenNavigationProp;
};

const ProfilePage: React.FC<Props> = ({ navigation }) => {
  const [profileImage, setProfileImage] = useState(resonateFaceBackground);

  useEffect(() => {
    const loadProfileImage = async () => {
      try {
        const imageUri = await AsyncStorage.getItem('profileImage');
        if (imageUri !== null) {
          setProfileImage({ uri: imageUri });
        }
      } catch (error) {
        console.log("Error loading profile image:", error);
      }
    };

    loadProfileImage();
  }, []);

  const saveProfileImage = async (uri: string) => {
    try {
      await AsyncStorage.setItem('profileImage', uri);
      setProfileImage({ uri });
    } catch (error) {
      console.log("Error saving profile image:", error);
    }
  };

  const selectImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets && response.assets[0].uri) {
        saveProfileImage(response.assets[0].uri);
      }
    });
  };

  const takePhoto = () => {
    launchCamera({ mediaType: 'photo' }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled camera');
      } else if (response.errorCode) {
        console.log('Camera Error: ', response.errorMessage);
      } else if (response.assets && response.assets[0].uri) {
        saveProfileImage(response.assets[0].uri);
      }
    });
  };

  const handleImagePress = () => {
    Alert.alert(
      'Change Profile Picture',
      'Choose an option',
      [
        { text: 'Take Photo', onPress: takePhoto },
        { text: 'Choose from Gallery', onPress: selectImage },
        { text: 'Cancel', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={stylesProfile.container}>
        <View style={stylesProfile.profileSection}>
          <TouchableOpacity onPress={handleImagePress}>
            <Image source={profileImage} style={stylesProfile.profileImage} />
          </TouchableOpacity>
          <Text style={stylesProfile.profileName}>Jennifer Tan</Text>
          <Text style={stylesProfile.profileSubtitle}>Hearing-Impaired</Text>
        </View>
        <View style={stylesProfile.infoSection}>
          <Text style={stylesProfile.sectionTitle}>About Me</Text>
          <View style={stylesProfile.infoRow}>
            <Image source={mailIcon} style={stylesProfile.infoIcon} />
            <Text style={stylesProfile.infoText}>jennifer123@gmail.com</Text>
            <TouchableOpacity>
              <Image source={{ uri: 'https://img.icons8.com/pulsar-line/48/edit.png' }} style={stylesProfile.editIcon} />
            </TouchableOpacity>
          </View>
          <View style={stylesProfile.infoRow}>
            <Image source={phoneIcon} style={stylesProfile.infoIcon} />
            <Text style={stylesProfile.infoText}>012-3456789</Text>
            <TouchableOpacity>
              <Image source={{ uri: 'https://img.icons8.com/pulsar-line/48/edit.png' }} style={stylesProfile.editIcon} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={stylesProfile.settingsSection}>
          <Text style={stylesProfile.sectionTitle}>General Setting</Text>
          {renderSettingItem("English", "App Language")}
          {renderSettingItem("English", "Subtitles Language")}
          {renderSettingItem("", "About")}
          {renderSettingItem("", "Share this App")}
          {renderSettingItem("", "Logout")}
        </View>
      </ScrollView>
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => navigation.navigate("ARScene")}
      >
        <Image source={videoFace} style={styles.floatingButtonIcon} />
      </TouchableOpacity>
    </View>
  );
};

const renderSettingItem = (value: string, title: string) => (
  <View style={stylesProfile.settingRow} key={title}>
    <Image source={info} style={stylesProfile.infoIcon} />
    <Text style={stylesProfile.settingTitle}>{title}</Text>
    {value ? <Text style={stylesProfile.settingValue}>{value}</Text> : null}
    <TouchableOpacity>
      <Image source={{ uri: 'https://img.icons8.com/pulsar-line/48/000000/forward.png' }} style={stylesProfile.editIcon} />
    </TouchableOpacity>
  </View>
);

export default ProfilePage;
