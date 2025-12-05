import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  ScrollView,
  Pressable,
  StyleSheet,
  Text as RNText,
  Dimensions,
  LayoutChangeEvent,
} from "react-native";
import Svg, {
  Path,
  Circle,
  Line,
  Rect,
  Text as SvgText,
} from "react-native-svg";
import * as d3 from "d3";
import dayjs from "dayjs";

const SCREEN_WIDTH = Dimensions.get("window").width;
const VISIBLE_HOURS = 7;
const CHART_HEIGHT = 300;
const BOTTOM_AXIS_HEIGHT = 30;
const X_AXIS_OFFSET = 30;

const data = [
  2000, 5000, 4500, 2130, 2140, 6000, 8931, 10931, 1543, 9121, 1000, 3500, 7200,
  1800, 5600, 11500, 4120, 950, 6800, 2900, 12000, 7500, 2500,
];

export default function BarChart() {
  const scrollRef = useRef<ScrollView>(null);

  const itemWidth = SCREEN_WIDTH / VISIBLE_HOURS;

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [tooltipWidth, setTooltipWidth] = useState(0);

  const hours = data.map((_, i) => `${String(i).padStart(2, "0")}:00`);

  const xScale = useMemo(
    () =>
      d3
        .scaleBand()
        .domain(hours)
        // .range([PADDING_LEFT, CHART_WIDTH - PADDING_LEFT])
        .range([0, itemWidth * (data.length - 1) + 80])
        .padding(0.2),
    []
  );

  const yMax = d3.max(data)!;
  const yMin = d3.min(data)!;

  const yScale = useMemo(
    () =>
      d3
        .scaleLinear()
        .domain([0, yMax])
        .range([CHART_HEIGHT - BOTTOM_AXIS_HEIGHT - 8, 12]),
    [yMax]
  );

  const numTicks = 4;
  const yTicks = Array.from({ length: numTicks + 1 }, (_, i) =>
    Math.round((yMax / numTicks) * i)
  );

  const formatPtNumber = (value: number) =>
    d3.format(",.0f")(value).replace(/,/g, ".");

  const biggestLabel = formatPtNumber(yMax);
  const yAxisWidth = biggestLabel.length * 9;

  useEffect(() => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollToEnd({ animated: false });
    });
    setSelectedIndex(data.length - 1);
  }, []);

  return (
    <View>
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
            marginBottom: 100,
            // borderBlockColor: "red",
            // borderWidth: 1,
            flexDirection: "row",
            paddingRight: 10,
          }}
        >
          <Svg
            height={CHART_HEIGHT + X_AXIS_OFFSET}
            width={itemWidth * data.length + yAxisWidth}
            // width={CHART_WIDTH + yAxisWidth}
          >
            {yTicks.map((tick, i) => (
              <SvgText
                key={i}
                x={itemWidth * data.length + yAxisWidth}
                y={yScale(tick) + 4}
                fontSize="12"
                fill="#9BABBF"
                textAnchor="end"
              >
                {formatPtNumber(tick)}
              </SvgText>
            ))}

            {data.map((value, i) => {
              const hour = hours[i];
              const x = xScale(hour)!;
              const barWidth = xScale.bandwidth();
              const barHeight =
                CHART_HEIGHT - BOTTOM_AXIS_HEIGHT - yScale(value);

              return (
                <Rect
                  key={i}
                  x={x}
                  y={yScale(value)}
                  width={barWidth}
                  height={barHeight}
                  rx={4}
                  fill={selectedIndex === i ? "#354053" : "#3540534D"}
                  onPress={() => setSelectedIndex(i)}
                />
              );
            })}

            {/* {hours.map((hour, i) => {
              const x = xScale(hour)! + xScale.bandwidth() / 2;
              return (
                <SvgText
                  key={i}
                  x={x}
                  y={CHART_HEIGHT - 10}
                  fontSize="12"
                  fill="#9BABBF"
                  textAnchor="middle"
                >
                  {hour}
                </SvgText>
              );
            })} */}

            {hours.map((hour, i) => {
              const x = xScale(hour)! + xScale.bandwidth() / 2;

              return (
                <React.Fragment key={i}>
                  {selectedIndex === i && (
                    <Rect
                      x={x - 40 / 2}
                      y={CHART_HEIGHT - 10 - 20 / 2}
                      width={40}
                      height={30}
                      rx={6}
                      fill="#F9D56D"
                    />
                  )}

                  <SvgText
                    x={x}
                    y={CHART_HEIGHT}
                    fontSize="12"
                    textAnchor="middle"
                    fontFamily="System"
                    fontWeight={selectedIndex === i ? "bold" : "normal"}
                    fill={selectedIndex === i ? "#354053" : "#9BABBF"}
                    onPress={() => setSelectedIndex(i)}
                  >
                    {hour}
                  </SvgText>
                </React.Fragment>
              );
            })}
          </Svg>
        </View>
      </ScrollView>
    </View>
  );
}
