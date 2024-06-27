import React, { useState, useRef } from "react";
import { Image, View, TextInput, TouchableOpacity, Text, StyleSheet, Keyboard, Modal, Animated, PanResponder, FlatList } from "react-native";
import styles from "../../styles/ar_page_styles";

const ARConverse: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("German");
  const [languages] = useState([
    "English(default)",
    "Chinese",
    "German",
    "French",
    "Spanish",
    "Japanese",
    "Malay",
    "Korean",

  ]);

  const translateY = useRef(new Animated.Value(0)).current;
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return gestureState.dy < -10;
      },
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dy < 0) {
          Animated.timing(translateY, {
            toValue: -gestureState.dy,
            duration: 0,
            useNativeDriver: false,
          }).start();
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dy < -50) {
          setModalVisible(true);
        }
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;

  const handleSend = () => {
    console.log(textInput);
    setTextInput("");
    Keyboard.dismiss();
  };

  const renderLanguageItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={styles.languageItem}
      onPress={() => {
        setSelectedLanguage(item);
        setLanguageModalVisible(false);
      }}
    >
      <Text style={styles.languageText2}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <>
      <Animated.View
        style={[styles.handle, { transform: [{ translateY }] }]}
        {...panResponder.panHandlers}
      >
        <View style={styles.handleInner} />
      </Animated.View>
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.textInput}
              placeholder="What do you want to say?"
              placeholderTextColor='#676C70'
              value={textInput}
              onChangeText={setTextInput}
            />
            <View style={styles.row}>
            <View style={styles.spaceFiller}></View>
              <TouchableOpacity onPress={() => setLanguageModalVisible(true)} style={styles.dropdown}>
                <Text style={styles.languageTextDrop}>{selectedLanguage}</Text>
                <Image source={{ uri: 'https://img.icons8.com/pulsar-line/48/expand-arrow.png' }} style={styles.dropdownIcon} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                <Image source={{ uri: 'https://img.icons8.com/pulsar-line/48/speaker.png' }} style={styles.iconImage} />
                <Text style={styles.sendButtonText}>Send</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={languageModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setLanguageModalVisible(false)}
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
    </>
  );
};

export default ARConverse;
