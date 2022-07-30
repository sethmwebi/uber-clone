import { useRef, useMemo, useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
	View,
	Text,
	FlatList,
	useWindowDimensions,
	ActivityIndicator,
} from "react-native";
import BottomSheet, {
	BottomSheetFlatList,
	BottomSheetView,
} from "@gorhom/bottom-sheet";
import orders from "../../../assets/data/orders.json";
import OrderItem from "../../components/OrderItem";
import MapView, { Marker } from "react-native-maps";
import { Entypo } from "@expo/vector-icons";

const OrdersScreen = () => {
	const bottomSheetRef = useRef(null);
	const { width, height } = useWindowDimensions();

	const snapPoints = useMemo(() => ["12%", "95%"], []);

	return (
		<GestureHandlerRootView style={{ backgroundColor: "lightblue", flex: 1 }}>
			<MapView style={{ height, width }} showsUserLocation followsUserLocation>
				{orders.map((order) => (
					<Marker
						key={order.id}
						title={order.Restaurant.name}
						description={order.Restaurant.address}
						coordinate={{
							latitude: order.Restaurant.lat,
							longitude: order.Restaurant.lng,
						}}
					>
						<View
							style={{ backgroundColor: "green", padding: 5, borderRadius: 20 }}
						>
							<Entypo name="shop" size={24} color="white" />
						</View>
					</Marker>
				))}
			</MapView>
			<BottomSheet ref={bottomSheetRef} snapPoints={snapPoints}>
				<BottomSheetView style={{ alignItems: "center" }}>
					<Text
						style={{
							fontSize: 20,
							fontWeight: "600",
							letterSpacing: 0.5,
							paddingBottom: 5,
						}}
					>
						You're online
					</Text>
					<Text style={{ letterSpacing: 0.5, color: "grey" }}>
						Available Orders: {orders.length}
					</Text>
				</BottomSheetView>
				<BottomSheetFlatList
					data={orders}
					renderItem={({ item }) => <OrderItem order={item} />}
				/>
			</BottomSheet>
		</GestureHandlerRootView>
	);
};

export default OrdersScreen;
