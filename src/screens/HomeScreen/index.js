import { StyleSheet, FlatList, View } from "react-native";
import restaurants from "../../../assets/data/restaurants.json";

import RestaurantItem from "../../components/RestaurantItem";

export default function HomeScreen() {
  return (
    <View style={styles.page}>
    <FlatList
      data={restaurants}
      renderItem={({ item }) => <RestaurantItem restaurant={item} />}
      showsVerticalScrollIndicator={false}
    />
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    paddingHorizontal: 10
  }
});
