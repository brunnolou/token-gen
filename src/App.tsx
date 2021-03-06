import {
  Box,
  Code,
  Container,
  Divider,
  FormControl,
  FormLabel,
  HStack,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  StackDivider,
  StackProps,
  Text,
  useTheme,
  VStack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Grid,
} from "@chakra-ui/react";
import { useControls } from "leva";
import MultiSlider from "multi-slider";

import React, { useState } from "react";
import "./App.css";
import { getColumnWidth } from "./space";
import { add, runningTotal } from "./utils";

type Step = {
  index: number;
  bg: string;
  values: number;
};

const range = (length = 20, unit = 8, multi: number) =>
  Array(length)
    .fill(0)
    .map((_, i) => unit * (i + multi));

const shitArray = (range = [0], min = 0) => {
  return range.filter((x) => x > min);
};

const scales = {
  fibonacci: [0, 1, 2, 3, 5, 8, 13, 21, 34],
};

const namedScaleLabel = ["xxs", "xs", "s", "m", "l", "xl", "xxl"];

function App() {
  const [baseUnit, setBaseUnit] = useState(8);

  const theme = useTheme();

  const [stepsCount, setStepsCount] = useState([0, 1, 5, 8, 4, 2]);
  console.log("stepsCount: ", stepsCount);
  // const [dividends, setDividends] = useState([
  // 1 * 2 ** 2,
  // 1 * 2 ** 1,
  // 1,
  // 1 / 2,
  //   1 / 2 ** 2,
  //   1 / 2 ** 3,
  // ]);
  const [dividends, setDividends] = useState([
    1,
    1 / 2 ** 1,
    1 / 2 ** 2,
    1 / 2 ** 3,
    1 / 2 ** 4 * 1.6, // little help because 1440 and 1600 are hard to find
    1 / 2 ** 5,
  ]); // breakpoints needs bigger dividends

  const [namedCount, setNamedCount] = useState([6, 4, 2, 3, 1, 2, 1, 0]);
  console.log('namedCount: ', namedCount);

  let namedCountSum = -1;

  let prevLast = 0;
  let prevRange = [0];
  const stepScales = dividends.map((div, rootIndex) => {
    const shiftIndex = prevRange.findIndex((x) => x >= prevLast);

    const currentRange = range(
      stepsCount[rootIndex] + 180,
      baseUnit,
      shiftIndex
    )
      .map((i) => i / div)
      .slice(0, stepsCount[rootIndex]);

    if (currentRange[currentRange.length - 1] !== undefined)
      prevLast = currentRange[currentRange.length - 1];

    prevRange = currentRange;

    return currentRange;
  });

  let prevScale = 0;
  const shiftStepScales = stepScales.map((step, rootIndex) => {
    prevScale = stepScales[rootIndex - 1]?.slice(-1)[0];

    return shitArray(step, prevScale);
  });

  let prev = 0;
  let stepsSum = 0;

  var colors = [
    theme.colors.orange[400],
    theme.colors.yellow[400],
    theme.colors.green[400],
    theme.colors.blue[400],
    theme.colors.purple[400],
    theme.colors.red[400],
  ];

  // @ts-ignore
  const steps = stepsCount.reduce<Step>((acc, step, stepIndex) => {
    // To make sure the sum fit
    prev -= prev % (baseUnit / dividends[stepIndex]);

    return [
      // @ts-ignore
      ...acc,
      ...Array(step)
        .fill(0)
        .map((_, i) => {
          const value = prev + baseUnit / dividends[stepIndex];
          prev = value;
          stepsSum++;
          return {
            index: stepsSum,
            bg: colors[stepIndex],
            value: value,
          };
        }),
    ];
  }, []);

  const { base, columnWidth, gap, lines } = useControls({
    base: 4,
    columnWidth: 16,
    gap: 8,
    lines: 18,
  });

  const grid = {
    gap: base * gap,
    column: base * columnWidth,
    container: getColumnWidth(12, base * columnWidth, base * gap),
  };

  return (
    <>
      <ScaleItem index={"Gap"} value={grid.gap} bg={colors[1]} />
      <ScaleItem index={"Col"} value={grid.column} bg={colors[2]} />
      <ScaleItem index={"12"} value={grid.container} bg={colors[3]} />

      <br />

      <VStack align="flex-start">
        {Array(lines)
          .fill(0)
          .map((_, i) => {
            const value = getColumnWidth(i + 1, base * columnWidth, base * gap);
            const maxWidth = getColumnWidth(
              lines + 2,
              base * columnWidth,
              base * gap
            );

            return (
              <div>
                <ScaleItem
                  w={maxWidth}
                  index={i + 1}
                  value={value}
                  bg={colors[0]}
                  highlighted={[
                    320, 384, 480, 576, 768, 1024, 1440, 1600,
                  ].includes(value)}
                />
                <ScaleItem
                  w={maxWidth + base * gap}
                  index={i + 1 + "+"}
                  value={value + base * gap}
                  bg={"rgba(0,0,0,.2)"}
                  highlighted={[
                    320, 384, 480, 576, 768, 1024, 1440, 1600,
                  ].includes(value + base * gap)}
                />
              </div>
            );
          })}
      </VStack>

      <Container w={grid.container + "px"} maxW={grid.container + "px"}>
        <Grid gap={grid.gap + "px"} w="100%" templateColumns="repeat(12, 1fr)">
          {Array(12)
            .fill(0)
            .map((_, i) => (
              <Box bg="rgba(255,0,0, .3)" h={400}>
                {i + 1}
              </Box>
            ))}
        </Grid>
      </Container>
      <Container className="App">
        <Box>
          <HStack justify="space-between" p={4}>
            <HStack>
              <FormControl id="amount">
                <FormLabel>Base Unit</FormLabel>
                <HStack justify="space-between">
                  <NumberInput
                    size="xs"
                    min={0.1}
                    value={baseUnit}
                    onChange={(valueString) => setBaseUnit(Number(valueString))}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  {dividends.map((division, i) => (
                    <VStack>
                      <Code>{(baseUnit / division).toFixed(2)}</Code>
                      {/* <FormControl id="step1">
                <NumberInput
                  size="xs"
                  min={0}
                  value={division}
                  onChange={(valueString) =>
                    setDividends((s) =>
                      Object.assign([], s, { [i]: Number(valueString) })
                    )
                  }
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl> */}
                    </VStack>
                  ))}
                </HStack>
              </FormControl>
            </HStack>
          </HStack>
        </Box>
      </Container>
      <Container className="App">
        <Tabs>
          <TabList>
            <Tab>Numeric</Tab>
            <Tab>Named</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <MultiSlider
                handleSize={6}
                padX={12}
                handleInnerDotSize={5}
                trackSize={3}
                bg="rgba(0,0,0, .2)"
                handleStrokeSize={0}
                onChange={setStepsCount}
                colors={colors}
                defaultValues={stepsCount}
              />
              {/* {stepsCount.join(", ")} */}
              <VStack
                align="flex-start"
                spacing="10"
                divider={<StackDivider borderColor="gray.200" />}
              >
                {(prev = 0)}
                {(stepsSum = 0)}
                <VStack align="flex-start" spacing="xs">
                  <ScaleItem index={0} value={0} bg={colors[0]} />
                  {/* @ts-ignore */}
                  {steps.map(({ index, bg, value: dValue }, i) => {
                    const value = dValue * 2;

                    return (
                      <ScaleItem
                        index={index}
                        // index={baseUnit / dividends[stepIndex]}
                        highlighted={namedCount
                          .reduce(runningTotal, [])
                          .includes(i + 1)}
                        bg={bg}
                        value={value}
                      />
                    );
                  })}
                </VStack>
                {(prev = 0)}
                {/* <ScaleItem index={1} value={baseUnit} /> */}
                {/* <VStack align="flex-start" spacing="xs">
          <ScaleItem index={0} value={0} />
          {Array(step1)
            .fill(0)
            .map((_, i) => {
              const value = prev + baseUnit / 4;
              prev = value;
              return <ScaleItem index={i + 1} value={value} />;
            })}
          {Array(step2)
            .fill(0)
            .map((_, i) => {
              const value = prev + baseUnit / 2;

              prev = value;
              return (
                <ScaleItem index={i + 2 + step1} value={value} bg="green.100" />
              );
            })}
          {Array(step3)
            .fill(0)
            .map((_, i) => {
              const value = prev + baseUnit / 1;

              prev = value;
              return (
                <ScaleItem
                  index={i + 2 + step1 + step2}
                  value={value}
                  bg="orange.100"
                />
              );
            })}
          {Array(step4)
            .fill(0)
            .map((_, i) => {
              const value = prev + baseUnit / 0.5; //1 * (1 + Math.round(i * multi));

              prev = value;
              return (
                <ScaleItem
                  index={i + 2 + step1 + step2 + step3}
                  value={value}
                  bg="red.100"
                />
              );
            })}
        </VStack> */}
              </VStack>
            </TabPanel>

            <TabPanel>
              <MultiSlider
                handleSize={6}
                padX={12}
                handleInnerDotSize={5}
                trackSize={3}
                bg="rgba(0,0,0, .2)"
                handleStrokeSize={0}
                onChange={setNamedCount}
                colors={colors}
                defaultValues={namedCount}
              />
              {/* <p>
              Running:
              {namedCount.reduce(runningTotal, []).join(", ")}
            </p> */}
              {/* NAMED SCALE */}
              <VStack
                align="flex-start"
                spacing="10"
                divider={<StackDivider borderColor="gray.200" />}
              >
                <VStack align="flex-start" spacing="2">
                  {/* @ts-ignore */}
                  {steps.map(({ value: dValue }, i) => {
                    const value = dValue * 2;
                    const isIncluded = namedCount
                      .reduce(runningTotal, [])
                      .includes(i + 1);

                    if (isIncluded) namedCountSum++;

                    if (namedCountSum > namedScaleLabel.length - 1) return null;

                    return (
                      isIncluded && (
                        <HStack align="center">
                          <Text
                            sx={{
                              fontSize: 12,
                              lineHeight: 1,
                              fontWeight: "bold",
                              textAlign: "left",
                            }}
                            w="40px"
                          >
                            {namedScaleLabel[namedCountSum]}
                          </Text>

                          <Text sx={{ fontSize: 12, lineHeight: 1 }} w="40px">
                            {value.toFixed(2).replace(".00", "")}px
                          </Text>
                          <Box
                            sx={{
                              // boxSize: `${value}px`,
                              w: `${value}px`,
                              h: "8px",
                              fontSize: 10,
                              whiteSpace: "nowrap",
                            }}
                            bg={colors[namedCountSum % colors.length]}
                          ></Box>
                          {/* <Text sx={{ fontSize: `${value}px`, lineHeight: 1 }}>
                            Title
                          </Text> */}
                        </HStack>
                      )
                    );
                  })}
                </VStack>
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Container>
    </>
  );
}

const ScaleItem: React.FC<
  { index?: number | string; value: number; highlighted?: boolean } & StackProps
> = ({
  value: valueInitial,
  index,
  bg = "blue.100",
  highlighted = false,
  ...props
}) => {
  // const value = Math.round(valueInitial);
  const value = valueInitial;
  return (
    <HStack align="center" {...props} spacing="1">
      <Code w="40px" sx={{ fontWeight: highlighted ? "bold" : "normal" }}>
        {index}
      </Code>
      <Text
        sx={{
          fontSize: 12,
          lineHeight: 1,
          fontWeight: highlighted ? "bold" : "normal",
          bg: highlighted ? "yellow.100" : undefined,
        }}
        w="80px"
      >
        {value.toFixed(2).replace(".00", "")}px
      </Text>

      <Box bg={bg} textAlign="left" w={`${value}px`} h={3} />
    </HStack>
  );
};
export default App;
