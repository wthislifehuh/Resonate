import { StyleSheet } from 'react-native';
import colors from './colors';

const stylesProfile = StyleSheet.create({
  scrollContainer: {
    padding: 20,
    backgroundColor: colors.darkGrey,
  },
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
  profileTextContainer: {
    alignItems: 'center',
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  profileName: {
    fontSize: 18,
    color: colors.white,
    marginLeft: 10,
  },
  profileSubtitle: {
    fontSize: 14,
    color: '#888888',
    marginLeft: 10,
  },
  infoSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    color: colors.white,
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
    color: colors.white,
  },
  editIcon: {
    width: 20,
    height: 20,
    tintColor: colors.white,
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
    color: colors.white,
  },
  settingValue: {
    fontSize: 16,
    color: colors.white,
    marginRight: 10,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 23,
    right: 23,
    backgroundColor: colors.yellow,
    width: 75,
    height: 75,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  floatingButtonIcon: {
    width: 60,
    height: 60,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: colors.pink,
    borderRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: colors.black,
  },
  textInput: {
    height: 40,
    borderColor: colors.grey,
    borderWidth: 1,
    marginBottom: 12,
    padding: 10,
    backgroundColor: colors.white,
    color: colors.black,
    borderRadius: 10,
  },
  saveButton: {
    backgroundColor: colors.black,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
  },
  saveButtonText: {
    color: colors.white,
    fontSize: 16,
  },
  languageItem: {
    padding: 10,
  },
  languageText2: {
    fontSize: 18,
    color: colors.black,
  },
  area: {
    height: 30,
  },
});

export default stylesProfile;
