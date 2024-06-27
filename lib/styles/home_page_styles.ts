// styles/home_page_styles.ts
import { StyleSheet } from 'react-native';
import colors from './colors';

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.grey,
  },
  profileSection: {
    alignItems: 'center',
    paddingTop: 15,
    backgroundColor: colors.darkGrey,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    backgroundColor: colors.darkGrey,
    paddingVertical: 16,
    paddingLeft: 10,
    borderRadius: 16,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  profileTextContainer: {
    marginLeft: 20,
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white,
  },
  profileSubtitle: {
    fontSize: 14,
    color: colors.lightGrey,
  },
  profileDescriptionContainer: {
    flexDirection: 'column',
    width: '90%',
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 30,
    marginTop: 16,
    marginBottom: 50,
  },
  profileDescription: {
    fontSize: 14,
    marginBottom: 8,
    color: colors.black,
  },
  languageSelectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  icon: {
    width: 24,
    height: 24,
  },
  leftIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.black,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 6,
    marginHorizontal: 10,
  },
  dropdownIcon: {
    width: 15,
    height: 15,
    marginLeft: 10,
  },
  languageText1: {
    color: colors.white,
    marginRight: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -22,
    marginBottom: 16,
    marginHorizontal: 30,
    paddingHorizontal: 16,
    backgroundColor: colors.yellow,
    borderRadius: 20,
    paddingLeft: 20,
  },
  searchInput: {
    backgroundColor: colors.yellow,
    padding: 9,
    fontSize: 16,
    color: colors.darkGrey,
    flex: 1,
  },
  searchIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  recentSummaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    marginLeft: 10,
    color: colors.black,
    paddingHorizontal: 16,
  },
  recentSummaryDate: {
    fontSize: 14,
    color: colors.middleGrey,
    marginBottom: 16,
    marginLeft: 10,
    paddingHorizontal: 16,
  },
  conversationList: {
    marginBottom: 16,
    marginHorizontal: 4,
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.darkGrey,
    padding: 16,
    borderRadius: 40,
    marginBottom: 16,
    marginHorizontal: 16,
  },
  conversationImage: {
    width: 70,
    height: 70,
    borderRadius: 50,
    marginRight: 3,
  },
  conversationTextContainer: {
    marginLeft: 10,
    flex: 1,
  },
  conversationName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.white,
  },
  conversationDate: {
    fontSize: 14,
    color: colors.grey,
  },
  conversationTopic: {
    fontSize: 14,
    color: colors.pink,
  },
  infoBox: {
    flexDirection: 'row',
    marginTop: 5,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 27,
    right: 27,
    backgroundColor: colors.yellow,
    width: 75,
    height: 75,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  floatingButtonIcon: {
    width: 50,
    height: 50,
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
    height: 150,
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
});

export default styles;
