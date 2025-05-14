import { colors } from "@/constants/theme";
import React from "react";
import { Image, StyleSheet, View } from "react-native";

const index = () => {
  return (
    <View style={styles.container}>
      <Image
        style={styles.logo}
        resizeMode="contain"
        source={require("../assets/images/splashScreen.png")}
      />
    </View>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.green,
  },

  logo: {
    height: "20%",
    aspectRatio: 1,
  }
});
