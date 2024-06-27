// styles/home_page_styles.ts
import { StyleSheet } from 'react-native';
import colors from './colors';

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: colors.black,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  profileTextContainer: {
    marginLeft: 16,
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.black,
  },
  profileSubtitle: {
    fontSize: 14,
    color: colors.darkGrey,
  },
  profileDescriptionContainer: {
    backgroundColor: colors.grey,
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
  },
  profileDescription: {
    fontSize: 14,
    marginBottom: 8,
    color: colors.black,
  },
  languageSelectionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  languageSelectionText: {
    fontSize: 14,
    color: colors.black,
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: colors.yellow,
    padding: 8,
    borderRadius: 8,
    fontSize: 16,
  },
  recentSummaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: colors.black,
  },
  recentSummaryDate: {
    fontSize: 14,
    color: colors.darkGrey,
    marginBottom: 16,
  },
  conversationList: {
    marginBottom: 16,
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.black,
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  conversationImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  conversationTextContainer: {
    marginLeft: 16,
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
    color: colors.yellow,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: colors.darkGrey,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;
