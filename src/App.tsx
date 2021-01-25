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
} from "@chakra-ui/react";
import MultiSlider from "multi-slider";

import React, { useState } from "react";
import "./App.css";
import { add, runningTotal } from "./utils";

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

  const [stepsCount, setStepsCount] = useState([1, 6, 5, 3, 3, 2]);
  const [dividends, setDividends] = useState([4, 2, 1, 0.5, 0.25, 0.125]);

  const [namedCount, setNamedCount] = useState([3, 2, 3, 4, 2, 2, 3, 0]);

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

  const steps = stepsCount.reduce<
    {
      index: number;
      bg: string;
      values: number;
    }[]
  >((acc, step, stepIndex) => {
    // To make sure the sum fit
    prev -= prev % (baseUnit / dividends[stepIndex]);

    return [
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

  return (
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
                {steps.map(({ index, bg, value }, i) => (
                  <ScaleItem
                    index={index}
                    // index={baseUnit / dividends[stepIndex]}
                    highlighted={namedCount
                      .reduce(runningTotal, [])
                      .includes(i + 1)}
                    bg={bg}
                    value={value}
                  />
                ))}
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
                {steps.map(({ value }, i) => {
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
                            boxSize: `${value}px`,
                            fontSize: 10,
                            whiteSpace: "nowrap",
                          }}
                          bg={colors[namedCountSum % colors.length]}
                        ></Box>
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
  );
}

const ScaleItem: React.FC<
  { index?: number; value: number; highlighted: boolean } & StackProps
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
    <HStack align="flex-start" {...props} spacing="0">
      <Code w="40px">{index}</Code>
      <Text
        sx={{
          fontSize: 12,
          lineHeight: 1,
          fontWeight: highlighted ? "bold" : "normal",
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
