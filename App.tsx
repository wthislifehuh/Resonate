import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { ScreenshotProvider } from './src/context/imageContext'; // Adjust the path as necessary
import HomePage from "./lib/pages/home_page";
import ARScene from "./lib/pages/ar/arscene";
import ProfilePage from "./lib/pages/profile_page";
import { RootStackParamList } from "./lib/pages/types";
import { TextRecognitionProvider } from './src/context/textContext';

const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <TextRecognitionProvider>
    <ScreenshotProvider>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomePage}
          options={{ headerShown: false }} // Hide the header for HomePage
        />
        <Stack.Screen 
          name="ARScene" 
          component={ARScene}  
          options={{ headerShown: false }} />
        <Stack.Screen 
          name="Profile" 
          component={ProfilePage} 
          options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
    </ScreenshotProvider>
    </TextRecognitionProvider>
  );
};

export default App;
