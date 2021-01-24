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
} from "@chakra-ui/react";
import MultiSlider from "multi-slider";

import React, { useState } from "react";
import "./App.css";
import { add } from "./utils";

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

function App() {
  const [baseUnit, setBaseUnit] = useState(8);
  const [multi, setMulti] = useState(1);

  // const [div1, setStep1] = useState(4);
  // const [div2, setStep2] = useState(2);
  // const [div3, setStep3] = useState(1);
  // const [div4, setStep4] = useState(1);

  const theme = useTheme();

  const [stepsCount, setStepsCount] = useState([1, 6, 5, 3, 3, 2]);
  const [dividends, setDividends] = useState([4, 2, 1, 0.5, 0.25, 0.125]);

  const [namedCount, setNamedCount] = useState([1, 2, 3, 5, 8, 13, 17]);

  let namedCountSum = 0;

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

  const steps = stepsCount.reduce<{
    index: number;
    bg: string;
    values: number;
  }>((acc, step, stepIndex) => {
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
      <Box p={4}>
        <HStack>
          <FormControl id="amount">
            <FormLabel>Base Unit</FormLabel>
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
          </FormControl>
          <FormControl id="multiplier">
            <FormLabel>Tail multiplier</FormLabel>
            <NumberInput
              size="xs"
              min={0}
              value={multi}
              onChange={(valueString) => setMulti(Number(valueString))}
              step={0.01}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
        </HStack>

        <MultiSlider
          handleSize={6}
          padX={12}
          handleInnerDotSize={5}
          trackSize={3}
          bg="rgba(0,0,0, .2)"
          handleStrokeSize={0}
          onChange={setNamedCount}
          colors={["#eee", ...colors]}
          defaultValues={namedCount}
        />

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
        {stepsCount.join(", ")}

        <HStack>
          {dividends.map((division, i) => (
            <VStack>
              <Code>{(baseUnit / division).toFixed(2)}</Code>
              <FormControl id="step1">
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
              </FormControl>
            </VStack>
          ))}
        </HStack>
      </Box>

      <VStack
        align="flex-start"
        spacing="10"
        divider={<StackDivider borderColor="gray.200" />}
      >
        <VStack align="flex-start" spacing="3">
          {steps.slice(namedCount[0]).map(({ index, bg, value }, i) => {
            const isIncluded = scales.fibonacci.includes(i + 1);


            return (
              isIncluded && (
                <Box
                  sx={{
                    boxSize: `${value}px`,
                    my: 4,
                    fontSize: 10,
                    whiteSpace: "nowrap",
                  }}
                  bg={colors[i % colors.length]}
                  value={value}
                >
                  {value}
                </Box>
              )
            );
          })}
        </VStack>

        {(prev = 0)}
        {(stepsSum = 0)}
        <VStack align="flex-start" spacing="xs">
          <ScaleItem index={0} value={0} bg={colors[0]} />
          {steps.map(({ index, bg, value }) => (
            <ScaleItem
              index={index}
              // index={baseUnit / dividends[stepIndex]}
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
    </Container>
  );
}

const ScaleItem: React.FC<{ index?: number; value: number } & StackProps> = ({
  value: valueInitial,
  index,
  bg = "blue.100",
  ...props
}) => {
  // const value = Math.round(valueInitial);
  const value = valueInitial;
  return (
    <HStack align="flex-start" {...props} spacing="0">
      <Code w="40px">{index}</Code>
      <Text sx={{ fontSize: 12, lineHeight: 1 }} w="80px">
        {value.toFixed(2).replace(".00", "")}px
      </Text>

      <Box bg={bg} textAlign="left" w={`${value}px`} h={3} />
    </HStack>
  );
};
export default App;
