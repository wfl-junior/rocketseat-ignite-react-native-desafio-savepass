import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import React, { Fragment, useCallback, useState } from "react";
import { Alert } from "react-native";

import { Header } from "../../components/Header";
import { LoginDataItem } from "../../components/LoginDataItem";
import { SearchBar } from "../../components/SearchBar";

import {
  Container,
  LoginList,
  Metadata,
  Title,
  TotalPassCount,
} from "./styles";

interface LoginDataProps {
  id: string;
  service_name: string;
  email: string;
  password: string;
}

type LoginListDataProps = LoginDataProps[];

export function Home() {
  const [searchText, setSearchText] = useState("");
  const [searchListData, setSearchListData] = useState<LoginListDataProps>([]);
  const [data, setData] = useState<LoginListDataProps>([]);

  async function loadData() {
    const dataKey = "@savepass:logins";
    // Get asyncStorage data, use setSearchListData and setData

    try {
      const data = await AsyncStorage.getItem(dataKey);

      if (data) {
        const parsedData = JSON.parse(data);
        setData(parsedData);
        setSearchListData(parsedData);
      }
    } catch (error) {
      console.warn(error);
      Alert.alert("Não foi possível carregar dados");
    }
  }

  function handleFilterLoginData() {
    // Filter results inside data, save with setSearchListData
    setSearchListData(
      data.filter(list => {
        return list.service_name
          .toLowerCase()
          .includes(searchText.toLowerCase());
      }),
    );
  }

  function handleChangeInputText(text: string) {
    // Update searchText value
    setSearchText(text);
  }

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, []),
  );

  return (
    <Fragment>
      <Header
        user={{
          name: "Wallace Júnior",
          avatar_url: "https://github.com/wfl-junior.png",
        }}
      />
      <Container>
        <SearchBar
          placeholder="Qual senha você procura?"
          onChangeText={handleChangeInputText}
          value={searchText}
          returnKeyType="search"
          onSubmitEditing={handleFilterLoginData}
          onSearchButtonPress={handleFilterLoginData}
        />

        <Metadata>
          <Title>Suas senhas</Title>
          <TotalPassCount>
            {searchListData.length
              ? `${searchListData.length.toString().padStart(2, "0")} ao total`
              : "Nada a ser exibido"}
          </TotalPassCount>
        </Metadata>

        <LoginList
          keyExtractor={item => item.id}
          data={searchListData}
          renderItem={({ item: loginData }) => (
            <LoginDataItem
              service_name={loginData.service_name}
              email={loginData.email}
              password={loginData.password}
            />
          )}
        />
      </Container>
    </Fragment>
  );
}
