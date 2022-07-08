import { yupResolver } from "@hookform/resolvers/yup";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { useForm } from "react-hook-form";
import { Alert, KeyboardAvoidingView, Platform } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import uuid from "react-native-uuid";
import * as Yup from "yup";

import { Button } from "../../components/Form/Button";
import { Input } from "../../components/Form/Input";
import { Header } from "../../components/Header";

import { StackNavigationProp } from "@react-navigation/stack";
import { Container, Form } from "./styles";

interface FormData {
  service_name: string;
  email: string;
  password: string;
}

const schema = Yup.object().shape({
  service_name: Yup.string().required("Nome do serviço é obrigatório!"),
  email: Yup.string()
    .email("Não é um email válido")
    .required("Email é obrigatório!"),
  password: Yup.string().required("Senha é obrigatória!"),
});

type RootStackParamList = {
  Home: undefined;
  RegisterLoginData: undefined;
};

type NavigationProps = StackNavigationProp<
  RootStackParamList,
  "RegisterLoginData"
>;

export function RegisterLoginData() {
  const { navigate } = useNavigation<NavigationProps>();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: yupResolver(schema) });

  async function handleRegister(formData: FormData) {
    const newLoginData = {
      id: String(uuid.v4()),
      ...formData,
    };

    const dataKey = "@savepass:logins";

    // Save data on AsyncStorage and navigate to 'Home' screen

    try {
      const existingData = await AsyncStorage.getItem(dataKey);
      const newData = [];

      if (existingData) {
        const parsedData = JSON.parse(existingData);
        newData.push(...parsedData);
      }

      newData.push(newLoginData);
      await AsyncStorage.setItem(dataKey, JSON.stringify(newData));
      navigate("Home");
    } catch (error) {
      console.warn(error);
      Alert.alert("Não foi possível salvar dados");
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      enabled
    >
      <Header />
      <Container>
        <Form>
          <Input
            testID="service-name-input"
            title="Nome do serviço"
            name="service_name"
            error={
              // Replace here with real content
              errors.service_name?.message
            }
            control={control}
            autoCapitalize="sentences"
            autoCorrect
          />
          <Input
            testID="email-input"
            title="E-mail ou usuário"
            name="email"
            error={
              // Replace here with real content
              errors.email?.message
            }
            control={control}
            autoCorrect={false}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <Input
            testID="password-input"
            title="Senha"
            name="password"
            error={
              // Replace here with real content
              errors.password?.message
            }
            control={control}
            secureTextEntry
          />

          <Button
            style={{ marginTop: RFValue(8) }}
            title="Salvar"
            onPress={handleSubmit(handleRegister)}
          />
        </Form>
      </Container>
    </KeyboardAvoidingView>
  );
}
