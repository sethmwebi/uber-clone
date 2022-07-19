import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import { useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import BasketDishItem from "../../components/BasketDishItem"
import { useBasketContext } from "../../context/BasketContext"
import { useOrderContext } from "../../context/OrderContext"
import { useNavigation } from "@react-navigation/native"

const Basket = () => {
	const { restaurant, basketDishes, totalPrice } = useBasketContext()
	const { createOrder } = useOrderContext()
	const navigation = useNavigation()

	const onCreateOrder = async () => {
		await createOrder()
		navigation.goBack()
	}

	return (
		<View style={styles.page}>
			<Text style={styles.name}>{restaurant?.name}</Text>
			<Text style={{fontWeight: "bold", marginTop: 20, fontSize: 19}}>Your Itemss</Text>

			<FlatList data={basketDishes} renderItem={({ item }) => <BasketDishItem basketDish={item}/>}/>

			<View style={styles.separator} />

			<Pressable onPress={onCreateOrder} style={styles.button}>
				<Text style={styles.buttonText}>Create Order  &#8226; ${totalPrice.toFixed(2)}</Text>
			</Pressable>
		</View>
	);
};

export default Basket;

const styles = StyleSheet.create({
	page: {
		flex: 1,
		width: "100%",
		paddingTop: 30,
		paddingHorizontal: 10,
	},
	name: {
		fontSize: 24,
		fontWeight: "700",
		marginVertical: 10,
	},
	description: {
		color: "#696969",
	},
	separator: {
		height: 1,
		backgroundColor: "lightgray",
		marginVertical: 10,
	},
	row: {
		flexDirection: "row",
		alignItems: "center",
		marginVertical: 15
	},
	quantity: {
		fontSize: 25,
		marginHorizontal: 20,
	},
	button: {
		backgroundColor: "black",
		marginTop: "auto",
		padding: 20,
	},
	buttonText: {
		color: "white",
		textAlign: "center",
		fontWeight: "700",
		fontSize: 20,
	},
	quantityContainer: {
		backgroundColor: "lightgray",
		paddingHorizontal: 5,
		marginRight: 10,
		paddingVertical: 2,
		borderRadius: 3,
	},
});
