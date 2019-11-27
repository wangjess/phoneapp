import store from "../store";
import SignUpLogin from "./SignUpLogIn";
// import SplashScreen from "./SplashScreen";
// import AddScreen from "./AddScreen/AddScreen";
// import ChooseGalleryScreen from "./ChooseGalleryScreen";
import { Navigation } from "react-native-navigation";
import { Provider } from "react-redux";
import { gestureHandlerRootHOC } from "react-native-gesture-handler";

export default function registerScreens(): void {
  Navigation.registerComponentWithRedux(
    "SignUpLogin",
    () => gestureHandlerRootHOC(SignUpLogin),
    Provider,
    store
  );
}
