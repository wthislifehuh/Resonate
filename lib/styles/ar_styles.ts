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
  });

  export default styles;