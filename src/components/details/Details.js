import {
  StyleSheet,
  Text,
  View,
  Button,
  Modal,
  ScrollView,
} from "react-native";

export const Details = ({ selectedUser, setSelectedUser }) => {
  const formatKey = (key) => {
    return key.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase());
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
            if (Array.isArray(value)) {
              return (
                <View
                  key={key}
                  style={styles.closeButton}
                >
                  <Text>{formatKey(key)}:
                    {value.length > 0 ? (
                      value.map((item, idx) => (
                        <Text key={idx}>{'\n'}* {item.name || item.title || item}</Text>
                      ))
                    ) : (
                      <Text>{` n/a`}</Text>
                    )}
                  </Text>
                </View>
              );
            } else if (typeof value === "object" && value !== null) {
              return (
                <View
                  key={key}
                  style={styles.closeButton}
                >
                  <Text>{formatKey(key)}:</Text>
                  <Text>
                    {value.name || value.title || JSON.stringify(value)}
                  </Text>
                </View>
              );
            } else if (key === "created" || key === "edited" || key === "url") {
              return;
            } else {
              return (
                <Text
                  key={key}
                  style={styles.closeButton}
                >
                  {formatKey(key)}: {value.length > 1 ? value : "n/a"}
                </Text>
              );
            }
          })}

          <Button
            title="Close"
            // style={styles.closeButton}
            onPress={() => setSelectedUser(null)}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  closeButton: {
    paddingBottom: 5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  scrollView: {
    flex: 1,
  },
});
