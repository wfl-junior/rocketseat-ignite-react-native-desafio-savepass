import React, { useState } from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { TextInputProps } from "react-native";

import {
  Container,
  Error,
  FormInput,
  Icon,
  InputContainer,
  Label,
  ToggleShowPassButton,
} from "./styles";

interface Props<T> extends TextInputProps {
  control: Control<T>;
  name: Path<T>;
  title: string;
  error?: string;
}

export function Input<T extends FieldValues = FieldValues>({
  name,
  control,
  title,
  error,
  secureTextEntry,
  ...rest
}: Props<T>) {
  const [passwordHidden, setPasswordHidden] = useState(true);

  return (
    <Container>
      <Label>{title}</Label>
      {error ? <Error>{error}</Error> : null}
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value } }) => (
          <InputContainer>
            <FormInput
              {...rest}
              onChangeText={onChange}
              value={value}
              secureTextEntry={secureTextEntry && passwordHidden}
            />
            {secureTextEntry && (
              <ToggleShowPassButton
                onPress={() => setPasswordHidden(!passwordHidden)}
              >
                <Icon name={passwordHidden ? "eye-off" : "eye"} />
              </ToggleShowPassButton>
            )}
          </InputContainer>
        )}
      />
    </Container>
  );
}
