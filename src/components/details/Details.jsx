import { StyleSheet, Text, View, Button, Modal } from 'react-native';
import { COLORS } from 'utils/Colors';

export const Details = ({ selectedUser, setSelectedUser }) => {
  const formatKey = (key) => {
    return key.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase());
  };

  const renderValue = (key, value) => {
    if (Array.isArray(value)) {
      return (
        <Text>
          {formatKey(key)}:
          {value.length > 0 ? (
            value.map((item, idx) => (
              <Text key={idx}>
                {'\n'}- {item.name || item.title || item}
              </Text>
            ))
          ) : (
            <Text>{` n/a`}</Text>
          )}
        </Text>
      );
    } else if (typeof value === 'object' && value !== null) {
      return (
        <>
          <Text>{formatKey(key)}:</Text>
          <Text>{value.name || value.title || JSON.stringify(value)}</Text>
        </>
      );
    } else if (typeof value === 'string' && value.trim() === '') {
      return <Text>{formatKey(key)}: n/a</Text>;
    } else {
      return (
        <Text>
          {formatKey(key)}: {value}
        </Text>
      );
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={!!selectedUser}
      onRequestClose={() => setSelectedUser(null)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {Object.entries(selectedUser).map(([key, value]) => {
            if (['created', 'edited', 'url'].includes(key)) return null;
            return (
              <View key={key} style={styles.closeButton}>
                {renderValue(key, value)}
              </View>
            );
          })}
          <Button title="Close" onPress={() => setSelectedUser(null)} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  closeButton: {
    paddingBottom: 5,
  },
  modalContent: {
    backgroundColor: COLORS.background,
    borderRadius: 10,
    padding: 20,
    width: 300,
  },
  modalOverlay: {
    alignItems: 'center',
    backgroundColor: COLORS.overlay,
    flex: 1,
    justifyContent: 'center',
  },
});
