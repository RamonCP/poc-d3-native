import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  ScrollView,
  Pressable,
  StyleSheet,
  Text,
  Dimensions,
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
const VISIBLE_HOURS = 6;
const CHART_HEIGHT = 200;
const CHART_WIDTH = SCREEN_WIDTH * 1.5;
const PADDING_LEFT = 45;
const BOTTOM_AXIS_HEIGHT = 30;
const TOUCH_WIDTH = 55;
const PADDING = 30;
const GRID_LINES = 5;

const data = [
  2000, 5000, 4500, 2130, 2140, 6000, 8931, 10931, 1543, 9121, 1829,
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
        .range([PADDING_LEFT, CHART_WIDTH - 20])
        .padding(0.25),
    []
  );

  const yMax = d3.max(data)!;

  const yScale = useMemo(
    () =>
      d3
        .scaleLinear()
        .domain([0, yMax])
        .range([CHART_HEIGHT - BOTTOM_AXIS_HEIGHT - 10, 20]),
    []
  );

  const yTicks = yScale.ticks(5);

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
            marginBottom: 40,
            // borderBlockColor: "red",
            // borderWidth: 1,
            marginRight: 40,
          }}
        >
          <Svg height={CHART_HEIGHT} width={itemWidth * data.length}>
            {/* {data.map((value, i) => {
              const x = xScale(i.toString())!;
              const barHeight = CHART_HEIGHT - 20 - yScale(value);

              return (
                <Rect
                  key={i}
                  x={x}
                  y={yScale(value)}
                  width={xScale.bandwidth()}
                  height={barHeight}
                  rx={6}
                  fill={selectedIndex === i ? "#4DA6FF" : "#79C1FF"}
                  onPress={() => setSelectedIndex(i)}
                />
              );
            })} */}
            {yTicks.map((tick, i) => (
              <SvgText
                key={i}
                x={PADDING_LEFT - 10}
                y={yScale(tick) + 4}
                fontSize="10"
                fill="#666"
                textAnchor="end"
              >
                {tick}
              </SvgText>
            ))}

            <Line
              x1={PADDING_LEFT}
              y1={20}
              x2={PADDING_LEFT}
              y2={CHART_HEIGHT - BOTTOM_AXIS_HEIGHT}
              stroke="#333"
              strokeWidth={1.5}
            />

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
                  rx={6}
                  fill={selectedIndex === i ? "#4DA6FF" : "#79C1FF"}
                  onPress={() => setSelectedIndex(i)}
                />
              );
            })}

            {hours.map((hour, i) => {
              const x = xScale(hour)! + xScale.bandwidth() / 2;
              return (
                <SvgText
                  key={i}
                  x={x}
                  y={CHART_HEIGHT - 10}
                  fontSize="10"
                  fill="#555"
                  textAnchor="middle"
                >
                  {hour}
                </SvgText>
              );
            })}

            <Line
              x1={PADDING_LEFT}
              y1={CHART_HEIGHT - BOTTOM_AXIS_HEIGHT}
              x2={CHART_WIDTH}
              y2={CHART_HEIGHT - BOTTOM_AXIS_HEIGHT}
              stroke="#333"
              strokeWidth={1.5}
            />
          </Svg>
        </View>
      </ScrollView>
    </View>
  );
}
