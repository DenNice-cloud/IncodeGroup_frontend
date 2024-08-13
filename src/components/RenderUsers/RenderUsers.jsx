import { StyleSheet, Text, Pressable, FlatList } from 'react-native';
import axios from 'axios';
import { COLORS } from 'utils/Colors';

export const RenderUsers = ({
  userData,
  setGenderCount,
  setSelectedUser,
  isLikeActive,
  setIsLikeActive,
}) => {
  const fetchAdditionalData = async (urls) => {
    let promises = [];

    if (typeof urls === 'string') {
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
    const home_world = await fetchAdditionalData(item.homeworld);
    const species = await fetchAdditionalData(item.species);
    const star_ships = await fetchAdditionalData(item.starships);
    const vehicles = await fetchAdditionalData(item.vehicles);

    setSelectedUser({
      ...item,
      films: filmData,
      homeworld: home_world,
      species: species,
      starships: star_ships,
      vehicles: vehicles,
    });
  };

  const handleButtonClick = async (item) => {
    setIsLikeActive((prevLikeStates) => ({
      ...prevLikeStates,
      [item.name]: !prevLikeStates[item.name],
    }));

    const genderMap = {
      male: 'Male',
      female: 'Female',
    };
    const currentGender = genderMap[item.gender] || 'Other';

    setGenderCount((prevGender) => ({
      ...prevGender,
      [currentGender]: isLikeActive[item.name]
        ? prevGender[currentGender] - 1
        : prevGender[currentGender] + 1,
    }));
  };

  const renderItem = ({ item }) => (
    <Pressable
      style={styles.usersList}
      onPress={() => handleItemClick(item)}
    >
      <Text style={styles.userName}>{item.name}</Text>

      <Pressable
        style={[
          styles.buttonLike,
          {
            backgroundColor: isLikeActive[item.name]
              ? COLORS.disabled
              : COLORS.primary,
          },
        ]}
        onPress={() => handleButtonClick(item)}
      >
        <Text style={styles.innerText}>Like</Text>
      </Pressable>
    </Pressable>
  );

  return (
    <FlatList
      data={userData.results}
      renderItem={renderItem}
      keyExtractor={(item) => item.name}
      style={styles.flatList}
    />
  );
};

const styles = StyleSheet.create({
  buttonLike: {
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  flatList: {
    borderColor: COLORS.disabled,
    borderWidth: 1,
  },
  innerText: {
    color: COLORS.text,
  },
  userName: {
    fontSize: 18,
  },
  usersList: {
    alignItems: 'center',
    borderColor: COLORS.disabled,
    borderRadius: 10,
    borderWidth: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 10,
    padding: 10,
  },
});
