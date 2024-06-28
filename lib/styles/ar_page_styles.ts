import { StyleSheet } from 'react-native';
import colors from './colors';

const styles = StyleSheet.create({
  handle: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 40,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
  },
  handleInner: {
    width: 100,
    height: 5,
    backgroundColor: '#888',
    borderRadius: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    height: '40%',
    backgroundColor: colors.grey,
    padding: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  textInput: {
    height: 50,  // Adjusted height for better UI
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    backgroundColor: colors.white,
    color: colors.black,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.yellow,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 6,
    marginRight: 10,
  },
  dropdownIcon: {
    width: 15,
    height: 15,
    marginLeft: 10,
  },
  languageTextDrop: {
    color: colors.black,
    marginRight: 5,
  },
  iconButton: {
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconImage: {
    height: 20,
    width: 20,
    tintColor: colors.white,
  },
  sendButton: {
    backgroundColor: colors.darkGrey,
    paddingVertical: 6,
    paddingHorizontal: 20,
    paddingRight: 25,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sendButtonText: {
    color: colors.white,
    fontSize: 15,
    marginLeft: 10,
  },
  closeButton: {
    backgroundColor: colors.darkGrey,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  languageItem: {
    padding: 10,
  },
  languageText2: {
    fontSize: 18,
    color: colors.black,
  },
  spaceFiller: {
    flex: 1,
  },
});

export default styles;
