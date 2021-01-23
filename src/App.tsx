import {
  Box,
  FormControl,
  FormLabel,
  HStack,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  StackProps,
  useTheme,
  VStack,
} from "@chakra-ui/react";
import MultiSlider from "multi-slider";

import React, { useState } from "react";
import "./App.css";

function App() {
  const [baseUnit, setBaseUnit] = useState(8);
  const [multi, setMulti] = useState(1);

  // const [step1, setStep1] = useState(4);
  // const [step2, setStep2] = useState(4);
  // const [step3, setStep3] = useState(4);
  // const [step4, setStep4] = useState(4);

  const theme = useTheme();

  const [values, setValues] = useState([2, 3, 6, 8]);

  const [step1, step2, step3, step4] = values;

  let prev = baseUnit / 2;

  var colors = [
    theme.colors.blue[300],
    theme.colors.green[300],
    theme.colors.orange[300],
    theme.colors.red[300],
    theme.colors.teal[300],
  ];

  return (
    <div className="App">
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
              min={1}
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
          onChange={setValues}
          colors={colors}
          defaultValues={[step1, step2, step3, step4]}
        />
        {values.join(", ")}
        {/* <FormControl id="step1">
          <FormLabel>Step1</FormLabel>
          <NumberInput
            size="xs"
            min={0}
            value={step1}
            onChange={(valueString) => setStep1(Number(valueString))}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>

        <FormControl id="step2">
          <FormLabel>Step2</FormLabel>
          <NumberInput
            size="xs"
            min={0}
            value={step2}
            onChange={(valueString) => setStep2(Number(valueString))}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>

        <FormControl id="step3">
          <FormLabel>Step3</FormLabel>
          <NumberInput
            size="xs"
            min={0}
            value={step3}
            onChange={(valueString) => setStep3(Number(valueString))}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>

        <FormControl id="step4">
          <FormLabel>Step4</FormLabel>
          <NumberInput
            size="xs"
            min={0}
            value={step4}
            onChange={(valueString) => setStep4(Number(valueString))}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl> */}
      </Box>

      <VStack align="flex-start" spacing="xs">
        <ScaleItem index={0} value={0} />
        {/* <ScaleItem index={1} value={baseUnit} /> */}
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
            const value = prev + baseUnit;

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
            const value = prev + baseUnit * (1 + Math.round(i * multi));

            prev = value;
            return (
              <ScaleItem
                index={i + 2 + step1 + step2 + step3}
                value={value}
                bg="red.100"
              />
            );
          })}
      </VStack>
    </div>
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
      <Box w="40px">{index}</Box>
      <Box w="80px">{value.toFixed(2).replace(".00", "")}px</Box>

      <Box bg={bg} textAlign="left" w={`${value}px`} h={3} />
    </HStack>
  );
};
export default App;
