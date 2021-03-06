import 'react-native-gesture-handler';
/**
 * @format
 */
import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {setCustomText, setCustomTextInput} from 'react-native-global-props';
import {customTextProps} from './App/appCustomStyles/customStyles';

setCustomText(customTextProps);
setCustomTextInput(customTextProps);

AppRegistry.registerComponent(appName, () => App);
