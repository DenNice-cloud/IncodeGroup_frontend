import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  FlatList,
  Modal,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import axios from "axios";
import { Details } from "./src/components/details/Details";

export default function App() {
  const [userData, setUserData] = useState([]);
  const [pageParams, setPageParams] = useState(1);
  const [changePage, setChangePage] = useState({
    next: null,
    previous: null,
  });
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchData = async (url) => {
    const response = await axios.get(url);

    setPageParams(url.split('?')[1].split('=')[1])
    setUserData(response.data);
    setChangePage({
      next: response.data.next,
      previous: response.data.previous,
    });
  };

  useEffect(() => {
    fetchData(`https://swapi.py4e.com/api/people/?page=1`);
  }, []);

  const fetchAdditionalData = async (urls) => {
    let promises = [];

    if (typeof urls === "string") {
      promises.push(axios.get(urls));
    } else {
      promises = urls.map((url) => axios.get(url));
    }

    const promiseAll = await Promise.all(promises);
    const results = promiseAll.map((promise) => promise.data);

    return results;
  };

  const handleItemClick = async (item) => {
    const filmData = await fetchAdditionalData(item.films);
    const homeworld = await fetchAdditionalData(item.homeworld);
    const species = await fetchAdditionalData(item.species);
    const starships = await fetchAdditionalData(item.starships);
    const vehicles = await fetchAdditionalData(item.vehicles);

    setSelectedUser({
      ...item,
      films: filmData,
      homeworld: homeworld,
      species: species,
      starships: starships,
      vehicles: vehicles,
    });
  };

  const renderUsers = ({ item }) => (
    <TouchableOpacity
      style={styles.usersList}
      onPress={() => handleItemClick(item)}
    >
      <Text style={styles.userName}>{item.name}</Text>

      <Button
        title="Like"
        onPress={() => console.log("Liked", item.name)}
      ></Button>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <FlatList
          data={userData.results}
          renderItem={renderUsers}
          keyExtractor={(item) => item.name}
          style={styles.flatList}
        />

        <View style={styles.pagination}>
          <Button
            title="<"
            onPress={() => fetchData(changePage.previous)}
            disabled={!changePage.previous}
          />

          <Text style={styles.pageText}>{`${pageParams * 10 - 9}-${
            pageParams * 10
          } of ${userData.count}`}</Text>

          <Button
            title=">"
            onPress={() => fetchData(changePage.next)}
            disabled={!changePage.next}
          />
        </View>

        {selectedUser && (
          <Details
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
    alignItems: "center",
  },
  pageText: {
    marginHorizontal: 10,
    fontSize: 16,
  },
  usersList: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderColor: "#ddd",
    borderRadius: 10,
    borderWidth: 2,
    padding: 10,
    margin: 10,
  },
  userName: {
    fontSize: 18,
  },
  flatList: {
    borderColor: "#ddd",
    borderWidth: 1,
  },
});
