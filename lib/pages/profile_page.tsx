import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, Alert, TextInput, Modal } from "react-native";
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
import profileDeco from '../assets/background/profile-deco.png'; // Import the background image

type Props = {
  navigation: ProfileScreenNavigationProp;
};

const ProfilePage: React.FC<Props> = ({ navigation }) => {
  const [profileImage, setProfileImage] = useState(resonateFaceBackground);
  const [profileName, setProfileName] = useState("Jennifer Tan");
  const [profileSubtitle, setProfileSubtitle] = useState("Hearing-Impaired");
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editField, setEditField] = useState("");
  const [editValue, setEditValue] = useState("");

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const imageUri = await AsyncStorage.getItem('profileImage');
        const name = await AsyncStorage.getItem('profileName');
        const subtitle = await AsyncStorage.getItem('profileSubtitle');
        if (imageUri !== null) setProfileImage({ uri: imageUri });
        if (name !== null) setProfileName(name);
        if (subtitle !== null) setProfileSubtitle(subtitle);
      } catch (error) {
        console.log("Error loading profile data:", error);
      }
    };

    loadProfileData();
  }, []);

  const saveProfileData = async (key: string, value: string) => {
    try {
      await AsyncStorage.setItem(key, value);
      if (key === 'profileName') setProfileName(value);
      if (key === 'profileSubtitle') setProfileSubtitle(value);
    } catch (error) {
      console.log("Error saving profile data:", error);
    }
  };

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

  const handleEditPress = (field: string) => {
    setEditField(field);
    setEditValue(field === 'profileName' ? profileName : profileSubtitle);
    setEditModalVisible(true);
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={stylesProfile.scrollContainer}>
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <Image source={profileDeco} style={stylesProfile.backgroundImage} />
        </TouchableOpacity>
        <View style={stylesProfile.profileSection}>
          <TouchableOpacity onPress={handleImagePress}>
            <Image source={profileImage} style={stylesProfile.profileImage} />
          </TouchableOpacity>
          <View style={stylesProfile.profileTextContainer}>
            <View style={stylesProfile.profileRow}>
              <TouchableOpacity onPress={() => handleEditPress('profileName')}>
                <Image source={{ uri: 'https://img.icons8.com/pulsar-line/48/edit.png' }} style={stylesProfile.editIcon} />
              </TouchableOpacity>
              <Text style={stylesProfile.profileName}>{profileName}</Text>
            </View>
            <View style={stylesProfile.profileRow}>
              <TouchableOpacity onPress={() => handleEditPress('profileSubtitle')}>
                <Image source={{ uri: 'https://img.icons8.com/pulsar-line/48/edit.png' }} style={stylesProfile.editIcon} />
              </TouchableOpacity>
              <Text style={stylesProfile.profileSubtitle}>{profileSubtitle}</Text>
            </View>
          </View>
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
        <View style={stylesProfile.area}></View>
      </ScrollView>

      <TouchableOpacity
        style={stylesProfile.floatingButton}
        onPress={() => navigation.navigate("ARScene")}
      >
        <Image source={videoFace} style={stylesProfile.floatingButtonIcon} />
      </TouchableOpacity>

      <Modal
        visible={editModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={stylesProfile.modalContainer}>
          <View style={stylesProfile.modalContent}>
            <Text style={stylesProfile.modalTitle}>Edit {editField === 'profileName' ? 'Name' : 'Description'}</Text>
            <TextInput
              style={stylesProfile.textInput}
              value={editValue}
              onChangeText={setEditValue}
            />
            <TouchableOpacity
              style={stylesProfile.saveButton}
              onPress={() => {
                saveProfileData(editField, editValue);
                setEditModalVisible(false);
              }}
            >
              <Text style={stylesProfile.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
