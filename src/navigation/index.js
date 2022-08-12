import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OrdersScreen from "../screens/OrdersScreen";
import OrdersDelivery from "../screens/OrdersDelivery";
import ProfileScreen from "../screens/ProfileScreen"
import { useAuthContext } from "../context/AuthContext"

const Stack = createNativeStackNavigator();

const Navigation = () => {
	const { dbCourier } = useAuthContext()
	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			{dbCourier ? (
				<>
			<Stack.Screen name="OrdersScreen" component={OrdersScreen} />
			<Stack.Screen name="OrdersDelivery" component={OrdersDelivery} />
			</>
			):(
				<Stack.Screen name="ProfileScreen" component={ProfileScreen}/>
			)}
		</Stack.Navigator>
	);
};

export default Navigation;
