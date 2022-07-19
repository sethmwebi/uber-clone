import { View, Text, StyleSheet, Pressable, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native"
import { DataStore } from "aws-amplify"
import { Dish } from "../../models"
import { useBasketContext } from "../../context/BasketContext"

const DishDetailsScreen = () => {
	const [quantity, setQuantity] = useState(1);
	const [dish, setDish] = useState(null)
	const navigation = useNavigation()
	const route = useRoute()
	const id = route.params?.id;

	const { addDishToBasket } = useBasketContext()

	useEffect(() => {
		if(id){
		  DataStore.query(Dish, id).then(setDish)
		}
	},[id])

	const onAddToBasket = async () => {
		await addDishToBasket(dish, quantity)
		navigation.goBack()
	}

	const onMinus = () => {
		if (quantity > 1) {
			setQuantity((prev) => prev - 1);
		}
	};

	const onPlus = () => {
		setQuantity((prev) => prev + 1);
	};

	const getTotal = () => {
		return (dish.price * quantity).toFixed(2);
	}

	if(!dish){
		return <ActivityIndicator color="grey" size="large"/>
	}

	return (
		<View style={styles.page}>
			<Text style={styles.name}>{dish.name}</Text>
			<Text style={styles.description}>{dish.description}</Text>
			<View style={styles.separator} />

			<View style={styles.row}>
				<AntDesign
					name="minuscircleo"
					size={60}
					color="black"
					onPress={onMinus}
				/>
				<Text style={styles.quantity}>{quantity}</Text>
				<AntDesign
					name="pluscircleo"
					size={60}
					color="black"
					onPress={onPlus}
				/>
			</View>

			<Pressable onPress={onAddToBasket} style={styles.button}>
				<Text style={styles.buttonText}>Add {quantity} to basket &#8226; (${getTotal()})</Text>
			</Pressable>
		</View>
	);
};

export default DishDetailsScreen;

const styles = StyleSheet.create({
	page: {
		flex: 1,
		width: "100%",
		paddingTop: 30,
		paddingHorizontal: 10,
	},
	name: {
		fontSize: 30,
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
		justifyContent: "center",
		marginTop: 50,
	},
	quantity: {
		fontSize: 25,
		marginHorizontal: 20,
	},
	button: {
		backgroundColor: "black",
		marginTop: "auto",
		padding: 20
	},
	buttonText: {
		color: "white",
		textAlign: "center",
		fontWeight: "700",
		fontSize: 20
	}
});
