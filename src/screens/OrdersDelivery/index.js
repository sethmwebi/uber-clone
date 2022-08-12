import { useMemo, useRef, useEffect, useState } from "react";
import {
	View,
	Text,
	useWindowDimensions,
	ActivityIndicator,
	Pressable,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, {
	BottomSheetFlatList,
	BottomSheetView,
} from "@gorhom/bottom-sheet";
import { FontAwesome5, Fontisto } from "@expo/vector-icons";
import styles from "./styles";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { Entypo, MaterialIcons, Ionicons } from "@expo/vector-icons";
import MapViewDirections from "react-native-maps-directions";
import { useNavigation, useRoute } from "@react-navigation/native";
import { DataStore } from "aws-amplify";
import { Order, User, OrderDish } from "../../models";
import { useOrderContext } from "../../context/OrderContext";

// const ORDER_STATUS = {
// 	READY_FOR_PICKUP: "READY_FOR_PICKUP",
// 	ACCEPTED: "ACCEPTED",
// 	PICKED_UP: "PICKED_UP",
// };

const OrderDelivery = () => {
	const { acceptOrder, user, dishes, fetchOrder, order, completeOrder, pickupOrder } = useOrderContext()

	const [ activeOrder, setActiveOrder ] = useState("")
	const [driverLocation, setDriverLocation] = useState(null);
	const [totalMinutes, setTotalMinutes] = useState(0);
	const [totalKm, setTotalKm] = useState(0);
	// const [deliveryStatus, setDeliveryStatus] = useState(
	// 	ORDER_STATUS.READY_FOR_PICKUP
	// );
	const [isDriverClose, setIsDriverClose] = useState(false);

	const { width, height } = useWindowDimensions();
	const bottomSheetRef = useRef(null);
	const mapRef = useRef(null);

	const snapPoints = useMemo(() => ["12%", "95%"], []);
	const navigation = useNavigation();
	const route = useRoute()
	const id = route.params?.id;

	useEffect(() => {
		fetchOrder(id)
	},[id])

	useEffect(() => {
		(async () => {
			let { status } = await Location.requestForegroundPermissionsAsync();
			if (!status === "granted") {
				console.log("Nonono");
				return;
			}

			let location = await Location.getCurrentPositionAsync();
			setDriverLocation({
				latitude: location.coords.latitude,
				longitude: location.coords.longitude,
			});
		})();

		const foregroundSubscription = Location.watchPositionAsync(
			{
				accuracy: Location.Accuracy.High,
				distanceInterval: 500,
			},
			(updatedLocation) => {
				setDriverLocation({
					latitude: updatedLocation.coords.latitude,
					longitude: updatedLocation.coords.longitude,
				});
			}
		);
		// return foregroundSubscription;
	}, []);

	const onButtonPress = async () => {
		if (order?.status === "READY_FOR_PICKUP") {
			bottomSheetRef.current?.collapse();
			mapRef.current?.animateToRegion({
				latitude: driverLocation.latitude,
				longitude: driverLocation.longitude,
				latitudeDelta: 0.01,
				longitudeDelta: 0.01,
			});
			// setDeliveryStatus(ORDER_STATUS.ACCEPTED);
			acceptOrder()
		}
		if (order?.status === "ACCEPTED") {
			// setDeliveryStatus(ORDER_STATUS.PICKED_UP);
			bottomSheetRef.current?.collapse();
			pickupOrder();
		}
		if (order?.status === "PICKED_UP") {
			await completeOrder()
			bottomSheetRef.current?.collapse();
			navigation.goBack();
		}
	};

	const renderButtonTitle = () => {
		if (order.status === "READY_FOR_PICKUP") {
			return "Accept Order";
		}
		if (order.status === "ACCEPTED") {
			return "Pick-Up Order";
		}
		if (order.status === "PICKED_UP") {
			return "Complete Delivery";
		}
	};

	const isButtonDisabled = () => {
		if (order.status === "READY_FOR_PICKUP") {
			return false;
		}
		if (order.status === "ACCEPTED" && isDriverClose) {
			return false;
		}
		if (order.status === "PICKED_UP" && isDriverClose) {
			return false;
		}
		return true;
	};

	const restaurantLocation = {
		latitude: order?.Restaurant?.lat,
		longitude: order?.Restaurant?.lng,
	};

	const deliveryLocation = {
		latitude: user?.lat,
		longitude: user?.lng,
	};

	if (!driverLocation || !user || !order) {
		return <ActivityIndicator size={"large"} color="grey" />;
	}

	return (
		<GestureHandlerRootView style={styles.container}>
			<MapView
				style={{ width, height }}
				ref={mapRef}
				showsUserLocation
				followsUserLocation
				initialRegion={{
					latitude: driverLocation.latitude,
					longitude: driverLocation.longitude,
					latitudeDelta: 0.07,
					longitudeDelta: 0.07,
				}}
			>
				<MapViewDirections
					origin={driverLocation}
					destination={
						order.status === "ACCEPTED"
							? restaurantLocation
							: deliveryLocation
					}
					strokeWidth={10}
					strokeColor="#3fc060"
					waypoints={
						order.status === "READY_FOR_PICKUP"
							? [restaurantLocation]
							: []
					}
					apikey={"AIzaSyAbl68UjFUrc4QL0F49pF4PEiFEgnDMZaQ"}
					onReady={(result) => {
						setIsDriverClose(result.distance <= 0.1);
						setTotalMinutes(result.duration);
						setTotalKm(result.distance);
					}}
				/>
				<Marker
					coordinate={{
						latitude: order.Restaurant.lat,
						longitude: order.Restaurant.lng,
					}}
					title={order.Restaurant.name}
					description={order.Restaurant.address}
				>
					<View
						style={{ backgroundColor: "green", padding: 5, borderRadius: 20 }}
					>
						<Entypo name="shop" size={30} color="white" />
					</View>
				</Marker>
				<Marker
					coordinate={deliveryLocation}
					title={user?.name}
					description={user?.address}
				>
					<View
						style={{ backgroundColor: "green", padding: 5, borderRadius: 20 }}
					>
						<MaterialIcons name="restaurant" size={30} color="white" />
					</View>
				</Marker>
			</MapView>
			{order.status === "READY_FOR_PICKUP" && (
				<Ionicons
					onPress={() => navigation.goBack()}
					name="arrow-back-circle"
					size={45}
					color="black"
					style={{ top: 40, left: 15, position: "absolute" }}
				/>
			)}

			<BottomSheet
				index={0}
				ref={bottomSheetRef}
				snapPoints={snapPoints}
				handleIndicatorStyle={styles.handleIndicator}
			>
				<BottomSheetView style={styles.handleIndicatorContainer}>
					<Text style={styles.routeDetailsText}>
						{totalMinutes.toFixed(0)} min
					</Text>
					<FontAwesome5
						name="shopping-bag"
						size={30}
						color="#3fc060"
						style={{ marginHorizontal: 10 }}
					/>
					<Text style={styles.routeDetailsText}>{totalKm.toFixed(2)} km</Text>
				</BottomSheetView>
				<BottomSheetView style={styles.deliveryDetailsContainer}>
					<Text style={styles.restaurantName}>{order.Restaurant.name}</Text>
					<BottomSheetView style={styles.addressContainer}>
						<Fontisto name="shopping-store" size={22} color="grey" />
						<Text
							style={{
								fontSize: 20,
								color: "grey",
								fontWeight: "600",
								letterSpacing: 0.5,
								marginLeft: 15,
							}}
						>
							{order.Restaurant.address}
						</Text>
					</BottomSheetView>
					<BottomSheetView style={styles.addressContainer}>
						<FontAwesome5 name="map-marker-alt" size={22} color="grey" />
						<Text
							style={{
								fontSize: 20,
								color: "grey",
								fontWeight: "600",
								letterSpacing: 0.5,
								marginLeft: 15,
							}}
						>
							{user?.address}
						</Text>
					</BottomSheetView>

					<BottomSheetView style={styles.orderDetailsContainer}>
						{dishes?.map((dishItem) => (
							<Text style={styles.orderItemText} key={dishItem.id}>
								{dishItem.Dish.name} x{dishItem.quantity}
							</Text>
						))}
					</BottomSheetView>
				</BottomSheetView>
				<Pressable
					onPress={onButtonPress}
					style={{
						...styles.buttonContainer,
						backgroundColor: isButtonDisabled() ? "gray" : "#3fc060",
					}}
					disabled={isButtonDisabled}
				>
					<Text style={styles.buttonText}>{renderButtonTitle()}</Text>
				</Pressable>
			</BottomSheet>
		</GestureHandlerRootView>
	);
};

export default OrderDelivery;
