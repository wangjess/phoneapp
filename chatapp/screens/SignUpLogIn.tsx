import React from "react";
import {
  AsyncStorage,
  ActivityIndicator,
  View,
  SafeAreaView,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  Platform,
  Alert, 
  Image
} from "react-native";
import { RootState } from "../reducers";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import CustomSpacer from "../components/CustomSpacer";
import ImageQueue from "../components/ImageQueue/index";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { UIConstants } from "../common/constants";
import { fontStyles } from "../common/styles";
import * as ApiConstants from "../api/constants";
import { withNavigation } from "react-navigation";
import * as ApiGetActions from "../api/actions/get";
import AddScreen from "./AddScreen";

type PropsFromState = {
  isLoggedIn: boolean;
  list_images: any[];
  list_category: any[];
  list_category_photos: any[];
  list_gallery: any[];
  // isLoading: boolean;
  // error: string;
};

type PropsFromDispatch = {
  fetchGallery: typeof ApiGetActions.fetchGallery;
  fetchCategory: typeof ApiGetActions.fetchCategories;
  fetchCategoryPhotos: typeof ApiGetActions.fetchCategoryPhotos;
};

type AllProps = PropsFromState & PropsFromDispatch;

type State = {
  isDisabled: boolean;
};

class SignUpLogin extends React.PureComponent<AllProps, State> {
  static navigationOptions = {
    title: "SignUpLogin",
    header: null
  };
  state = {
    isDisabled: false
  };


  constructor(props: AllProps) {
    super(props);
    this.fetchGallery();
    this.fetchCategory();
    this.fetchCategoryPhotos();
  }

  fetchGallery = async () => {
    const { isLoggedIn, fetchGallery } = this.props;

    // // Prevent unnecessary fetch
    // if (isLoading) {
    //   console.log('is loading, not going to fetch any additional time');
    //   return;
    // }

    try {
      await fetchGallery();
      console.log("api call??");
      //this.setState({list: response}) gallery.images object
      // isLoggedIn
      if (1) {
        this.props.navigation.navigate("Main");
      } else {
        this.props.navigation.navigate("LoginCreateAccount");
      }
    } catch (error) {
      // If an error occurred at this basic level, the server is most likely down, and the app should become unusable.
      this.setState({ isDisabled: true });
    }
  };

  // fetchCategory
  fetchCategory = async () => {
    const { isLoggedIn, fetchCategory } = this.props;

    try {
      console.log("about to call fetchCategory");
      await fetchCategory();
      console.log("fetchCategory API call??");
    } catch (error) {
      // If an error occurred at this basic level, the server is most likely down, and the app should become unusable.
      console.log("ERROR");
      this.setState({ isDisabled: true });
    }
  };

  // fetchCategoryPhotos
  fetchCategoryPhotos = async () => {
    const { isLoggedIn, fetchCategoryPhotos } = this.props;

    try {
      console.log("about to call fetchCategoryPhotos");
      await fetchCategoryPhotos();
      console.log("fetchCategoryPhotos API call??");
    } catch (error) {
      // If an error occurred at this basic level, the server is most likely down, and the app should become unusable.
      console.log("ERROR");
      this.setState({ isDisabled: true });
    }
  };

  // Render any loading content that you like here
  render() {
    const { list_images, list_category, list_category_photos, list_gallery } = this.props;
    console.log("LIST!!", list_category_photos);
    //let len = list.length;
    let listyboi = list_category_photos;
    console.log("LIST_IMAGES:\n", list_images);
    console.log("LIST_CATEGORY:\n", list_category);
    console.log("LIST_CATEGORY_PHOTOS:\n", list_category_photos); // todo! not working, expected, need debug
    console.log("LIST_GALLERY:\n", list_gallery);
    //console.log("first thing", listyboi[0]["image"]);
    // const stuff = listyboi.map(home => {home.name})
    return (
      <ImageBackground
        source={require("../assets/images/splash.png")}
        imageStyle={{ resizeMode: "contain" }}
        style={styles.backgroundImage}
      >
        <SafeAreaView style={styles.bodyContainer}>
          <Text
            numberOfLines={2}
            ellipsizeMode="tail"
            style={[fontStyles.headerLarge, styles.resultsTextContainer]}
          >
            {/* {list.length}  */}
            {/* {listyboi.map(image => {image.image})} */}
            {/* <Image 
              style={{width: 50, height: 50}}
              source={{uri: listyboi[0]["image"]}}
              resizeMode="contain"
            /> */}
            {/* {listyboi} */}
          </Text>
        </SafeAreaView>
      </ImageBackground>
    );
  }
}
const apiActionTypes = [ApiConstants.GET_GALLERY];

// // Show loading spinner on GET_APP_CONFIG
// const loadingSelector = createLoadingSelector(apiActionTypes);
// // Get error for GET_APP_CONFIG
// const errorSelector = createErrorMessageSelector(apiActionTypes);

const mapStateToProps = (state: RootState): PropsFromState => {
  console.log("In mapStateToProps");
  const { gallery } = state;
   console.log("Gallery SANITY CHECK: ", gallery);
  // console.log("gallery.images", gallery.images)
  console.log("SPLASH SCREEN LIST_CATEGORY", gallery.categoryList);

  return {
    isLoggedIn: true,
    list_images: gallery.images,
    list_category: gallery.categoryList,
    list_category_photos: gallery.categoryPhotosList,
    list_gallery: gallery.galleryID

    // isLoggedIn: !_.isEmpty(state.auth.token),
    // isLoading: loadingSelector(state),
    // error: errorSelector(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch): PropsFromDispatch =>
  bindActionCreators(
    {
      fetchGallery: ApiGetActions.fetchGallery,
      fetchCategory: ApiGetActions.fetchCategories,
      fetchCategoryPhotos: ApiGetActions.fetchCategoryPhotos,
      // TODO!
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignUpLogin);

// SignUpLogin.navigationOptions = {
//   header: null
// };

const styles = StyleSheet.create({
  bodyContainer: {
    position: "absolute",
    flexDirection: "column",
    alignItems: "flex-start",
    width: wp("100%"),
    height: "100%"
  },
  headerContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    width: wp("100%"),
    aspectRatio: 9 / 4
  },
  searchContainer: {
    width: "100%",
    aspectRatio: 4 / 1,
    flexDirection: "row",
    alignItems: "center"
  },
  searchBar: {
    width: "55%",
    aspectRatio: 3 / 1,
    backgroundColor: UIConstants.appWhiteColor,
    borderColor: UIConstants.appGrayColor,
    borderWidth: 4,
    borderRadius: 15,
    marginLeft: UIConstants.appMarginLeft,
    marginRight: wp("3%")
  },
  resultsTextContainer: {
    width: "100%",
    aspectRatio: 7 / 1,
    overflow: "hidden",
    flexWrap: "wrap",
    textAlign: "center",
    letterSpacing: 1,
    color: UIConstants.appGrayColor,
    marginLeft: UIConstants.appMarginLeft
  },
  backgroundImage: {
    position: "absolute",
    backgroundColor: "#F4EB78",
    height: "100%",
    width: "100%"
  }
});
