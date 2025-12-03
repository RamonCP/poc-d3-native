import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  ScrollView,
  Pressable,
  StyleSheet,
  Text,
  Dimensions,
} from "react-native";
import Svg, { Path, Circle, Line } from "react-native-svg";
import * as d3 from "d3";
import dayjs from "dayjs";

type LineChartProps = {
  data: number[];
  initialDate: string;
};

const SCREEN_WIDTH = Dimensions.get("window").width;
const VISIBLE_MONTHS = 6;
const CHART_HEIGHT = 200;
const TOUCH_WIDTH = 55;
const PADDING = 30;
const GRID_LINES = 5;

const months = [
  "jan",
  "fev",
  "mar",
  "abr",
  "mai",
  "jun",
  "jul",
  "ago",
  "set",
  "out",
  "nov",
  "dez",
];

// const data = [
//   1890120.9, 540320.15, 2300100.8, 980760.3, 1450600.44, 670120.01, 2450890.75,
//   1120300.67, 367723.53, 1250345.98, 850123.45, 1900500.77,
// ];
// const data = [120, 280, 150, 450, 300, 400, 380, 420, 500, 380, 360, 330];

export default function LineChart({ data, initialDate }: LineChartProps) {
  const scrollRef = useRef<ScrollView>(null);

  const itemWidth = SCREEN_WIDTH / VISIBLE_MONTHS;

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [tooltipWidth, setTooltipWidth] = useState(0);

  const xScale = useMemo(
    () =>
      d3
        .scaleLinear()
        .domain([0, data.length - 1])
        .range([PADDING, itemWidth * (data.length - 1) + PADDING]),
    [data]
  );

  const yScale = useMemo(
    () =>
      d3
        .scaleLinear()
        .domain([0, d3.max(data)!])
        .range([CHART_HEIGHT - 20, 20]),
    [data]
  );

  const linePath = useMemo(
    () =>
      d3
        .line<number>()
        .x((_, i) => xScale(i))
        .y((d) => yScale(d))
        .curve(d3.curveCatmullRom.alpha(0.5))(data)!,
    [data]
  );

  const x = selectedIndex !== null ? xScale(selectedIndex) : 0;

  const safeLeft =
    x !== undefined
      ? Math.min(
          Math.max(x - tooltipWidth / 2, PADDING),
          SCREEN_WIDTH - tooltipWidth - PADDING
        )
      : 0;

  useEffect(() => {
    if (!initialDate) return;

    const index = dayjs(initialDate).month(); // 0..11

    setSelectedIndex(index);

    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({
        x: index * TOUCH_WIDTH,
        animated: true,
      });
    });
  }, [initialDate]);

  return (
    <View>
      <View style={{ flex: 1 }}>
        <View style={StyleSheet.absoluteFill}>
          {Array.from({ length: GRID_LINES }).map((_, i) => {
            const top = ((CHART_HEIGHT + 90) / GRID_LINES) * i;
            return (
              <View
                key={i}
                style={{
                  position: "absolute",
                  top,
                  left: 0,
                  right: 0,
                  height: 1,
                  backgroundColor: "#9BABBF66",
                  opacity: 0.5,
                }}
              />
            );
          })}
        </View>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        ref={scrollRef}
      >
        <View
          style={{
            height: CHART_HEIGHT,
            paddingTop: 30,
            marginTop: 30,
            marginBottom: 40,
            // borderBlockColor: "red",
            // borderWidth: 1,
            marginRight: 40,
          }}
        >
          {selectedIndex !== null && (
            <View
              style={[
                styles.tooltipContainer,
                { height: CHART_HEIGHT + 100, top: 2 },
                {
                  left: x - tooltipWidth / 2,
                },
              ]}
            >
              <View
                style={[
                  styles.tooltip,
                  {
                    left: selectedIndex === 0 ? TOUCH_WIDTH / 2 : 0,
                  },
                ]}
                onLayout={(e) => {
                  setTooltipWidth(e.nativeEvent.layout.width);
                }}
              >
                <Text style={styles.tooltipText}>
                  R$ {data[selectedIndex].toLocaleString("pt-BR")}
                </Text>
              </View>

              {/* <View style={styles.dashedLine} /> */}
            </View>
          )}

          <Svg height={CHART_HEIGHT} width={itemWidth * data.length}>
            <Path d={linePath} stroke="#354053" strokeWidth={3} fill="none" />

            {selectedIndex !== null && (
              <Line
                x1={x}
                y1={0}
                x2={x}
                y2={CHART_HEIGHT}
                stroke="#354053"
                strokeWidth={1.5}
                strokeDasharray={[4, 4]}
                strokeLinecap="butt"
              />
            )}

            {selectedIndex !== null && (
              <Circle
                cx={x}
                cy={yScale(data[selectedIndex])}
                r={7}
                fill="#F9D56D"
                stroke="#354053"
                strokeWidth={2}
              />
            )}
          </Svg>

          <View style={[styles.touchLayer]}>
            {data.map((_, i) => (
              <Pressable
                key={i}
                style={{
                  //   width: itemWidth,
                  //   height: "100%",
                  //   justifyContent: "flex-end",
                  //   alignItems: "center",
                  position: "absolute",
                  left: xScale(i) - TOUCH_WIDTH / 2,
                  width: TOUCH_WIDTH,
                  height: CHART_HEIGHT,
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
                onPress={() => setSelectedIndex(i)}
              >
                <View
                  style={[
                    styles.monthBox,
                    selectedIndex === i && styles.monthBoxSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.monthText,
                      selectedIndex === i && styles.monthTextSelected,
                    ]}
                  >
                    {months[i]}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  touchLayer: {
    position: "absolute",
    top: 35,
    left: 0,
    height: CHART_HEIGHT,
  },

  tooltipContainer: {
    position: "absolute",
    top: 0,
    alignItems: "center",
    zIndex: 99,
    height: CHART_HEIGHT,
  },
  tooltip: {
    backgroundColor: "#F9D56D",
    paddingVertical: 4,
    paddingHorizontal: 5,
    borderRadius: 6,
  },
  tooltipText: {
    fontWeight: "bold",
    fontSize: 13,
    color: "#354053",
  },
  dashedLine: {
    width: 0,
    // backgroundColor: "red",
    height: CHART_HEIGHT,
    borderLeftWidth: 1.5,
    borderColor: "#354053",
    borderStyle: "dashed",
    marginTop: 4,
    elevation: 4,
    overflow: "visible",
    zIndex: 99,
  },

  monthBox: {
    marginTop: 10,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  monthBoxSelected: {
    backgroundColor: "#F9D56D",
    borderRadius: 8,
  },
  monthText: {
    color: "#9BABBF",
    fontSize: 14,
    textTransform: "lowercase",
  },
  monthTextSelected: {
    color: "#354053",
    fontWeight: "bold",
  },
});
