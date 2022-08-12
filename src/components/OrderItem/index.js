import { useState, useEffect } from "react"
import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { DataStore } from "aws-amplify";
import { User } from "../../models"

const OrderItem = ({ order }) => {
  const navigation = useNavigation()
  const [user, setUser] = useState(null)

  useEffect(() => {
    DataStore.query(User, order.userID).then(setUser)
  },[])
  return (
    <Pressable
      style={{
        flexDirection: "row",
        margin: 10,
        borderColor: "#3fc060",
        borderWidth: 2,
        borderRadius: 12,
      }}
      onPress={() => navigation.navigate("OrdersDelivery", { id: order.id })}
    >
      <Image
        source={{ uri: order.Restaurant.image }}
        style={{
          height: "100%",
          width: "25%",
          borderBottomLeftRadius: 10,
          borderTopLeftRadius: 10,
        }}
      />
      <View style={{ marginLeft: 10, flex: 1, paddingVertical: 5 }}>
        <Text style={{ fontSize: 18, fontWeight: "500" }}>
          {order.Restaurant.name}
        </Text>
        <Text style={{ color: "gray" }}>{order.Restaurant.address}</Text>
        <Text style={{ marginTop: 10 }}>Delivery Details</Text>
        <Text style={{ color: "gray" }}>{user?.name}</Text>
        <Text style={{ color: "gray" }}>{user?.address}</Text>
      </View>
      <View
        style={{
          padding: 5,
          backgroundColor: "#3fc060",
          borderBottomRightRadius: 10,
          borderTopRightRadius: 10,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Entypo
          name="check"
          size={30}
          color="white"
          style={{ marginLeft: "auto" }}
        />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
});

export default OrderItem;
