// App.tsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomePage from "./lib/home_page";
import ARScene from "./lib/arscene";
import { RootStackParamList } from "./lib/types";

const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomePage} />
        <Stack.Screen name="ARScene" component={ARScene} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
