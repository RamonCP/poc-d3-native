import { Image } from "expo-image";
import { Platform, StyleSheet, View } from "react-native";

import LineChart from "@/components/LineChart";
import BarChart from "@/components/BarChart";

const data = [
  1890120.9, 540320.15, 2300100.8, 980760.3, 1450600.44, 670120.01, 2450890.75,
  1120300.67, 367723.53, 1250345.98, 850123.45, 1900500.77,
];

export default function HomeScreen() {
  return (
    <View
      style={{
        backgroundColor: "#fff",
        marginTop: 80,
      }}
    >
      <LineChart initialDate={"2018-01-05T16:00:00.000Z"} data={data} />
      <BarChart />
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
