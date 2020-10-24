import React, { useState, useEffect } from "react";
import CheckoutSummary from "../../components/Order/CheckoutSummary/CheckoutSummary";

const Checkout = (props) => {
  const [state, setState] = useState({
    ingredients: {
      salad: 1,
      meat: 1,
      cheese: 1,
      bacon: 1,
    },
  });

  useEffect(() => {
    const query = new URLSearchParams(props.location.search);
    const ingredients = {};
    for (let param of query.entries()) {
      ingredients[param[0]] = +param[1];
    }
    setState({ ingredients: ingredients });
  }, [props.location.search]);

  const cancelOrderHandler = () => {
    props.history.goBack();
  };

  const confirmOrderHandler = () => {
    props.history.replace("./checkout/contact-data");
  };

  return (
    <div>
      <CheckoutSummary
        cancelOrder={cancelOrderHandler}
        confirmOrder={confirmOrderHandler}
        ingredients={state.ingredients}
      />
    </div>
  );
};

export default Checkout;
