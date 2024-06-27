import { StyleSheet } from 'react-native';
import colors from './colors';

const stylesProfile = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#0E1519',
      padding: 20,
    },
    // header: {
    //   alignItems: 'center',
    //   marginBottom: 20,
    // },
    // headerTitle: {
    //   fontSize: 24,
    //   color: '#FFFFFF',
    // },
    profileSection: {
      alignItems: 'center',
      marginTop: 15,
      marginBottom: 20,
    },
    profileImage: {
      width: 100,
      height: 100,
      borderRadius: 50,
      marginBottom: 10,
    },
    profileName: {
      fontSize: 18,
      color: '#FFFFFF',
    },
    profileSubtitle: {
      fontSize: 14,
      color: '#888888',
    },
    infoSection: {
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 18,
      color: '#FFFFFF',
      marginBottom: 10,
      fontWeight: 'bold',
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    infoIcon: {
      width: 50,
      height: 50,
      marginRight: 10,
    },
    infoText: {
      flex: 1,
      fontSize: 16,
      color: '#FFFFFF',
    },
    editIcon: {
      width: 20,
      height: 20,
      tintColor: '#FFFFFF',
    },
    settingsSection: {
      marginBottom: 20,
    },
    settingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    settingTitle: {
      flex: 1,
      fontSize: 16,
      color: '#FFFFFF',
    },
    settingValue: {
      fontSize: 16,
      color: '#FFFFFF',
      marginRight: 10,
    },
  });
  
  export default stylesProfile;