import { StyleSheet } from 'react-native';
import colors from './colors';

const styles = StyleSheet.create({
    f1: { flex: 1 },
    helloWorldTextStyle: {
      fontFamily: "Poppins", // Arial, sans-serif
      fontSize: 30,
      color: colors.white,
      textAlignVertical: "center",
      textAlign: "center",
      backgroundColor: colors.black,
    },
    backButton: {
      position: 'absolute',
      top: 6,
      left: 6,
      borderRadius: 20,
      padding: 10,
    },
    backButtonIcon: {
      width: 50,
      height: 50,
    },
    permissionContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#000',
      padding: 20,
    },
    permissionText: {
      color: '#fff',
      fontSize: 18,
      textAlign: 'center',
      marginBottom: 20,
    },
    alertText: {
      position: 'absolute',
      bottom: 50,
      left: 20,
      right: 20,
      backgroundColor: 'rgba(0,0,0,0.4)',
      color: colors.yellow,
      fontSize: 16,
      padding: 10,
      borderRadius: 30,
      textAlign: 'center',
      zIndex: 1000, // Ensure it appears above other elements
    },
  });

  export default styles;