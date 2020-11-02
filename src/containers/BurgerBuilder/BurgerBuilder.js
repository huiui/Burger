import React, { Fragment, useState, useEffect } from "react";
import Burger from "../../components/Burger/Burger";
import BuildControls from "../../components/Burger/BuildControls/BuildControls";
import Modal from "../../components/UI/Modal/Modal";
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary";
import axios from "../../axios-orders";
import Spinner from "../../components/UI/Spinner/Spinner";
import withErrorHandler from "../withErrorHandler/withErrorHandler";
import { connect } from "react-redux";
import * as actions from "../../store/actions/index";

const BurgerBuilder = (props) => {
  const [state, setState] = useState({
    purchasable: false,
    purchasing: false,
  });

  useEffect(props.initIngredients, []);

  const updatePurchaseState = (ingredients) => {
    const sum = Object.keys(ingredients)
      .map((igKey) => {
        return ingredients[igKey];
      })
      .reduce((sum, el) => {
        return sum + el;
      }, 0);
    return sum > 0;
  };

  const disabledInfo = { ...props.ings };
  for (let key in disabledInfo) {
    disabledInfo[key] = disabledInfo[key] <= 0;
  }

  const updatePurchasing = () => {
    if (props.isAuth) {
      setState((prevState) => {
        return { ...prevState, purchasing: true };
      });
    } else {
      props.onSetAuthRedirectPath("/checkout");
      props.history.push("/Auth");
    }
  };

  const removePurchasing = () => {
    setState((prevState) => {
      return { ...prevState, purchasing: false };
    });
  };

  const continueOrderHandle = () => {
    props.initPurchase();
    props.history.push("./checkout");
  };

  const orderSummary =
    props.ings === null ? (
      <Spinner />
    ) : (
      <OrderSummary
        ingredients={props.ings}
        cancelOrder={removePurchasing}
        continueOrder={continueOrderHandle}
        price={props.price}
      />
    );

  const burger = props.error ? (
    <p>Ingredients can't be loaded...</p>
  ) : props.ings === null ? (
    <Spinner />
  ) : (
    <Fragment>
      <Burger ingredients={props.ings} />
      <BuildControls
        addIngredient={props.onIngredientAdded}
        removeIngredient={props.onIngredientRemoved}
        disabledInfo={disabledInfo}
        purchasable={updatePurchaseState(props.ings)}
        order={updatePurchasing}
        price={props.price}
        isAuth={props.isAuth}
      />
    </Fragment>
  );

  return (
    <Fragment>
      <Modal show={state.purchasing} cancelModal={removePurchasing}>
        {orderSummary}
      </Modal>
      {burger}
    </Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    ings: state.burgerBuilder.ingredients,
    price: state.burgerBuilder.totalPrice,
    error: state.burgerBuilder.error,
    isAuth: state.auth.token !== null,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    onIngredientAdded: (ingName) => dispatch(actions.addIngredient(ingName)),
    onIngredientRemoved: (ingName) =>
      dispatch(actions.removeIngredient(ingName)),
    initIngredients: () => dispatch(actions.initIngredients()),
    initPurchase: () => dispatch(actions.purchaseInit()),
    onSetAuthRedirectPath: (path) =>
      dispatch(actions.setAuthRedirectionPath(path)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandler(BurgerBuilder, axios));
