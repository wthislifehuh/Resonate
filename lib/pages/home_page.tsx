import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, TextInput, ScrollView, Modal, FlatList } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HomeScreenNavigationProp } from "./types";
import styles from "../styles/home_page_styles";
import videoFace from '../assets/video-face.png';
import resonateFaceBackground from '../assets/resonate-background.png';
import info from '../assets/white-info.png';
import dropdown from '../assets/dropdown.png';

type Props = {
  navigation: HomeScreenNavigationProp;
};

const languages = ["English(default)", "Chinese", "German", "French", "Spanish", "Japanese", "Malay"];

const HomePage: React.FC<Props> = ({ navigation }) => {
  const [selectedLanguage, setSelectedLanguage] = useState("German");
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [profileDescription, setProfileDescription] = useState(
    "Hi, I’m Jennifer, a deaf. I am muted and can’t hear you. I am using Resonate - AR transcription and emotion recognition app to speak with you. I appreciate your understanding, and thank you for considering my situation."
  );
  const [editableDescription, setEditableDescription] = useState(profileDescription);
  const [profileImage, setProfileImage] = useState(resonateFaceBackground);

  useEffect(() => {
    const loadProfileDescription = async () => {
      try {
        const description = await AsyncStorage.getItem('profileDescription');
        if (description !== null) {
          setProfileDescription(description);
        }
      } catch (error) {
        console.log("Error loading profile description:", error);
      }
    };

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

    loadProfileDescription();
    loadProfileImage();
  }, []);

  const saveProfileDescription = async (description: string) => {
    try {
      await AsyncStorage.setItem('profileDescription', description);
      setProfileDescription(description);
    } catch (error) {
      console.log("Error saving profile description:", error);
    }
  };

  const renderLanguageItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={styles.languageItem}
      onPress={() => {
        setSelectedLanguage(item);
        setModalVisible(false);
      }}
    >
      <Text style={styles.languageText2}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.profileSection}>
          <View style={styles.profileContainer}>
            <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
              <Image
                source={profileImage}
                style={styles.profileImage}
              />
            </TouchableOpacity>
            <View style={styles.profileTextContainer}>
              <Text style={styles.profileName}>Jennifer Tan</Text>
              <Text style={styles.profileSubtitle}>Hearing-Impaired</Text>
            </View>
          </View>
          <View style={styles.profileDescriptionContainer}>
            <Text style={styles.profileDescription}>{profileDescription}</Text>
            <View style={styles.languageSelectionRow}>
              <View style={styles.leftIcons}>
                <TouchableOpacity onPress={() => setEditModalVisible(true)}>
                  <Image source={{ uri: 'https://img.icons8.com/pulsar-line/48/edit.png' }} style={styles.icon} />
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.dropdown}>
                <Text style={styles.languageText1}>{selectedLanguage}</Text>
                <Image source={dropdown} style={styles.dropdownIcon} />
              </TouchableOpacity>
              <TouchableOpacity>
                <Image source={{ uri: 'https://img.icons8.com/pulsar-line/48/speaker.png' }} style={styles.icon} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={styles.searchContainer}>
          <Image
            source={{ uri: 'https://img.icons8.com/pulsar-line/48/search-more.png' }}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search in conversations"
            placeholderTextColor="#C2B3A8"
          />
        </View>
        <Text style={styles.recentSummaryTitle}>RECENT SUMMARY</Text>
        <Text style={styles.recentSummaryDate}>March 2024</Text>
        <View style={styles.conversationList}>
          {renderConversation("Kathryn Jewelry", "1st March 2023 01:22 pm", "Learning Sign Language")}
          {renderConversation("Joe Ee Ho", "2nd March 2023 01:22 pm", "School Assignment")}
          {renderConversation("Ken How Goh", "2nd March 2023 01:22 pm", "School Assignment")}
          {renderConversation("Ken How Goh", "3nd March 2023 01:22 pm", "School Assignment")}
          {renderConversation("Wen Kai Soh", "3nd March 2023 01:32 pm", "School Assignment")}
        </View>
      </ScrollView>
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => navigation.navigate("ARScene")}
      >
        <Image source={videoFace} style={styles.floatingButtonIcon} />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FlatList
              data={languages}
              renderItem={renderLanguageItem}
              keyExtractor={(item) => item}
            />
          </View>
        </View>
      </Modal>

      <Modal
        visible={editModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>What's in your mind</Text>
            <TextInput
              style={styles.textInput}
              multiline
              value={editableDescription}
              onChangeText={setEditableDescription}
            />
            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => {
                saveProfileDescription(editableDescription);
                setEditModalVisible(false);
              }}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const renderConversation = (name: string, date: string, topic: string) => (
  <View style={styles.conversationItem} key={name + date}>
    <Image
      source={{ uri: 'https://img.icons8.com/pulsar-line/48/000000/user-male-circle.png' }}
      style={styles.conversationImage}
    />
    <View style={styles.conversationTextContainer}>
      <Text style={styles.conversationName}>Conversation with {name}</Text>
      <Text style={styles.conversationDate}>{date}</Text>
      <View style={styles.infoBox}>
        <Image source={info} style={styles.searchIcon} />
        <Text style={styles.conversationTopic}>{topic}</Text>
      </View>
    </View>
  </View>
);

export default HomePage;
