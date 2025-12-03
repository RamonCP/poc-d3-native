import { Image } from "expo-image";
import { Platform, StyleSheet, View } from "react-native";

import Chart from "@/components/LineChart";

export default function HomeScreen() {
  return (
    <View
      style={{
        backgroundColor: "#fff",
        marginTop: 80,
      }}
    >
      {/* <MyChart /> */}
      <Chart />
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
