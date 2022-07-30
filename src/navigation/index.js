import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OrdersScreen from "../screens/OrdersScreen";
import OrdersDelivery from "../screens/OrdersDelivery";

const Stack = createNativeStackNavigator();

const Navigation = () => {
	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			<Stack.Screen name="OrdersScreen" component={OrdersScreen} />
			<Stack.Screen name="OrdersDelivery" component={OrdersDelivery} />
		</Stack.Navigator>
	);
};

export default Navigation;
