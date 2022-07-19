import { View, Text, StyleSheet } from 'react-native'

const BasketDishItem = ({ basketDish }) => {
	return (
		<View style={styles.row}>
			<View style={styles.quantityContainer}>
				<Text>{basketDish?.quantity}</Text>
			</View>
			<Text style={{ fontWeight: "bold" }}>{basketDish?.Dish?.name}</Text>
			<Text style={{ marginLeft: "auto" }}>${basketDish?.Dish?.price}</Text>
		</View>
	);
};

export default BasketDishItem

const styles = StyleSheet.create({
	row: {
		flexDirection: "row",
		alignItems: "center",
		marginVertical: 15
	},
	quantityContainer: {
		backgroundColor: "lightgray",
		paddingHorizontal: 5,
		marginRight: 10,
		paddingVertical: 2,
		borderRadius: 3,
	},
});