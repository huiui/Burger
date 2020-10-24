import React, { useState } from "react";
import CheckoutSummary from "../../components/Order/CheckoutSummary/CheckoutSummary";
import { Route } from "react-router-dom";
import ContactData from "./ContactData/ContactData";

const Checkout = (props) => {
  const [state, setState] = useState(() => {
    const query = new URLSearchParams(props.location.search);
    const ingredients = {};
    let price = 0;
    for (let param of query.entries()) {
      if (param[0] === "price") {
        price = param[1];
      } else {
        ingredients[param[0]] = +param[1];
      }
    }
    return { ingredients: ingredients, totalPrice: price };
  });

  //   useEffect(() => {
  //     const query = new URLSearchParams(props.location.search);
  //     const ingredients = {};
  //     let price = 0;
  //     for (let param of query.entries()) {
  //       if (param[0] === "price") {
  //         price = param[1];
  //       } else {
  //         ingredients[param[0]] = +param[1];
  //       }
  //     }
  //     setState({ ingredients: ingredients, totalPrice: price });
  //   }, []);

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
      <Route
        path={props.match.path + "/contact-data"}
        render={(props) => {
          console.log(state.ingredients);
          return (
            <ContactData
              ingredients={state.ingredients}
              price={state.totalPrice}
              {...props}
            />
          );
        }}
      />
    </div>
  );
};

export default Checkout;
