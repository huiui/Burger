import React, { useEffect} from "react";
import {connect} from "react-redux";
import Order from "../../components/Order/Order";
import axios from "../../axios-orders";
import withErrorHandler from "../withErrorHandler/withErrorHandler";
import * as actions from "../../store/actions/index";
import Spinner from "../../components/UI/Spinner/Spinner";

const Orders = (props) => {
  useEffect(props.onFetchOrders, []);
  let orders = <Spinner/>;
  if (!props.loading){
    orders = props.currentOrders.map((order) => (
      <Order
        key={order.id}
        ingredients={order.ingredients}
        price={order.price}
      />
    ))
  }
  return (
    <div>
      {orders}
    </div>
  );
};

const mapDispatchToProps = dispatch => {
  return {
    onFetchOrders: ()=> dispatch(actions.fetchOrders())
  }
}

const mapStateToProps = state => {
  return {
    currentOrders: state.order.orders,
    loading: state.order.loading,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Orders, axios));
