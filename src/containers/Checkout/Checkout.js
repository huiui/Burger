import React from "react";
import CheckoutSummary from "../../components/Order/CheckoutSummary/CheckoutSummary";
import { Route, Redirect } from "react-router-dom";
import ContactData from "./ContactData/ContactData";
import { connect } from "react-redux";
const Checkout = (props) => {
  // const [state, setState] = useState(() => {
  //   const query = new URLSearchParams(props.location.search);
  //   const ingredients = {};
  //   let price = 0;
  //   for (let param of query.entries()) {
  //     if (param[0] === "price") {
  //       price = param[1];
  //     } else {
  //       ingredients[param[0]] = +param[1];
  //     }
  //   }
  //   return { ingredients: ingredients, totalPrice: price };
  // });

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

  let summary = <Redirect to="/" />;
  if (props.ings) {
    const purchasedRedirect = props.purchased && <Redirect to="/" />;
    summary = (
      <div>
        {purchasedRedirect}
        <CheckoutSummary
          cancelOrder={cancelOrderHandler}
          confirmOrder={confirmOrderHandler}
          ingredients={props.ings}
        />
        <Route
          path={props.match.path + "/contact-data"}
          component={ContactData}
        />
      </div>
    );
  }

  return summary;
};

const mapStateToProps = (state) => {
  return {
    ings: state.burgerBuilder.ingredients,
    purchased: state.order.purchased,
  };
};
export default connect(mapStateToProps)(Checkout);
