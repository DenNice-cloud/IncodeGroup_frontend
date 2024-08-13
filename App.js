import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  SafeAreaView,
} from 'react-native';
import axios from 'axios';
import { Details } from 'components/Details';
import { RenderUsers } from 'components/RenderUsers';
import { COLORS } from 'utils/Colors';

export default function App() {
  const [userData, setUserData] = useState([]);
  const [pageParams, setPageParams] = useState(1);
  const defaultPage = {
    next: null,
    previous: null,
  };
  const [changePage, setChangePage] = useState(defaultPage);

  const defaultGender = {
    Male: 0,
    Female: 0,
    Other: 0,
  };
  const [genderCount, setGenderCount] = useState(defaultGender);
  const [selectedUser, setSelectedUser] = useState(null);
  const defaultLike = {};
  const [isLikeActive, setIsLikeActive] = useState(defaultLike);

  const fetchData = async (url) => {
    const response = await axios.get(url);

    setPageParams(url.split('?')[1].split('=')[1]);
    setUserData(response.data);
    setChangePage({
      next: response.data.next,
      previous: response.data.previous,
    });
  };

  useEffect(() => {
    fetchData(`https://swapi.py4e.com/api/people/?page=1`);
  }, []);

  const handleClickReset = () => {
    setGenderCount(defaultGender);
    setIsLikeActive(defaultLike);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.genderCount}>
        {Object.entries(genderCount).map(([key, value]) => (
          <View key={key} style={styles.genderTablets}>
            <Text>{`${key}: ${value}`}</Text>
          </View>
        ))}
      </View>

      <View style={styles.resetButton}>
        <Pressable
          style={styles.resetButtonMain}
          onPress={handleClickReset}
        >
          <Text style={styles.innerText}>Reset</Text>
        </Pressable>
      </View>

      <View style={styles.container}>
        <RenderUsers
          isLikeActive={isLikeActive}
          setIsLikeActive={setIsLikeActive}
          userData={userData}
          setGenderCount={setGenderCount}
          setSelectedUser={setSelectedUser}
        />

        <View style={styles.pagination}>
          <Pressable
            style={[
              styles.paginationButton,
              changePage.previous
                ? styles.paginationButtonActive
                : styles.paginationButtonDisabled,
            ]}
            onPress={() => fetchData(changePage.previous)}
            disabled={!changePage.previous}
          >
            <Text style={styles.innerText}>{'<'}</Text>
          </Pressable>

          <Text style={styles.pageText}>{`${pageParams * 10 - 9}-${
            pageParams * 10
          } of ${userData.count}`}</Text>

          <Pressable
            style={[
              styles.paginationButton,
              changePage.next
                ? styles.paginationButtonActive
                : styles.paginationButtonDisabled,
            ]}
            onPress={() => fetchData(changePage.next)}
            disabled={!changePage.next}
          >
            <Text style={styles.innerText}>{'>'}</Text>
          </Pressable>
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
  container: {
    backgroundColor: COLORS.background,
    flex: 3,
    padding: 10,
  },
  genderCount: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  genderTablets: {
    alignItems: 'center',
    borderColor: COLORS.disabled,
    borderWidth: 2,
    flex: 1,
    justifyContent: 'center',
    margin: 10,
  },
  innerText: {
    color: COLORS.text,
  },
  pageText: {
    fontSize: 16,
    marginHorizontal: 10,
  },
  pagination: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  paginationButton: {
    borderRadius: 2,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  paginationButtonActive: {
    backgroundColor: COLORS.primary,
  },
  paginationButtonDisabled: {
    backgroundColor: COLORS.disabled,
  },
  resetButton: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 10,
  },
  resetButtonMain: {
    backgroundColor: COLORS.primary,
    borderRadius: 5,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  safeArea: {
    flex: 1,
  },
});
