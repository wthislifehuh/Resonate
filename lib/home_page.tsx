import React from "react";
import { View, Text, TouchableOpacity, Image, TextInput, ScrollView } from "react-native";
import { HomeScreenNavigationProp } from "./types";
import styles from "./styles/home_page_styles";
// import Icon from 'react-native-vector-icons/FontAwesome';

type Props = {
  navigation: HomeScreenNavigationProp;
};

const HomePage: React.FC<Props> = ({ navigation }) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileContainer}>
        <Image
          source={{ uri: 'https://example.com/jennifer-tan.jpg' }}
          style={styles.profileImage}
        />
        <View style={styles.profileTextContainer}>
          <Text style={styles.profileName}>Jennifer Tan</Text>
          <Text style={styles.profileSubtitle}>Hearing-Impaired</Text>
          <View style={styles.profileDescriptionContainer}>
            <Text style={styles.profileDescription}>
              Hi, I’m Jennifer, a deaf. I am muted and can’t hear you. I am using Resonate - AR transcription and emotion recognition app to speak with you. I appreciate your understanding, and thank you for considering my situation.
            </Text>
            <View style={styles.languageSelectionContainer}>
              <Text style={styles.languageSelectionText}>German</Text>
              {/* <Icon name="volume-up" size={24} color="black" /> */}
            </View>
          </View>
        </View>
      </View>
      <View style={styles.searchContainer}>
        <TextInput style={styles.searchInput} placeholder="Search in conversations" />
      </View>
      <Text style={styles.recentSummaryTitle}>RECENT SUMMARY</Text>
      <Text style={styles.recentSummaryDate}>March 2024</Text>
      <View style={styles.conversationList}>
        {renderConversation("Kathryn Jewelry", "1st March 2023 01:22 pm", "Learning Sign Language")}
        {renderConversation("Joe Ee Ho", "2nd March 2023 01:22 pm", "School Assignment")}
        {renderConversation("Ken How Goh", "2nd March 2023 01:22 pm", "School Assignment")}
      </View>
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => navigation.navigate("ARScene")}
      >
        {/* <Icon name="smile-o" size={24} color="white" /> */}
      </TouchableOpacity>
    </ScrollView>
  );
};

const renderConversation = (name: string, date: string, topic: string) => (
  <View style={styles.conversationItem} key={name + date}>
    <Image
      source={{ uri: 'https://example.com/profile-placeholder.png' }}
      style={styles.conversationImage}
    />
    <View style={styles.conversationTextContainer}>
      <Text style={styles.conversationName}>Conversation with {name}</Text>
      <Text style={styles.conversationDate}>{date}</Text>
      <Text style={styles.conversationTopic}>{topic}</Text>
    </View>
  </View>
);

export default HomePage;
