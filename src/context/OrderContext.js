import { createContext, useState, useEffect, useContext } from "react";
import { DataStore } from "aws-amplify";
import { Courier, Order, User, OrderDish } from "../models";
import { useAuthContext } from "./AuthContext"

const OrderContext = createContext({});

const OrderContextProvider = ({children}) => {
	const { dbCourier } = useAuthContext()
	const [ order, setOrder] = useState(null)
	const [user, setUser] = useState(null)
	const [dishes, setDishes] = useState(null)

	const fetchOrder = async (id) => {
		if(!id){
			setOrder(null);
			return;
		}
		const fetchedOrder = await DataStore.query(Order, id);
		setOrder(fetchedOrder);

		DataStore.query(User, fetchedOrder.userID).then(setUser);

		DataStore.query(OrderDish, (od) => od.orderID("eq", fetchedOrder.id)).then(setDishes);
		setOrder(fetchedOrder)
	}
	const acceptOrder = () => {
		// update the order, and change status, and assign the courier
		DataStore.save(
			Order.copyOf(order, (updated) => {
				updated.status = "ACCEPTED";
				updated.Courier = dbCourier;
			})
		).then(setOrder)
	}
	const pickupOrder = () => {
		// update the order, and change status, and assign the courier
		DataStore.save(
			Order.copyOf(order, (updated) => {
				updated.status = "PICKED_UP";
			})
		).then(setOrder)
	}
	const completeOrder = () => {
		// update the order, and change status, and assign the courier
		DataStore.save(
			Order.copyOf(order, (updated) => {
				updated.status = "COMPLETED";
				updated.Courier = dbCourier;
			})
		).then(setOrder)
	}
	return (
		<OrderContext.Provider value={{ acceptOrder, order, user, dishes, fetchOrder, pickupOrder, completeOrder }}>
			{children}
		</OrderContext.Provider>
	);
};

export default OrderContextProvider;

export const useOrderContext = () => useContext(OrderContext)
