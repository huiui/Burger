import React, { Fragment, useState, useEffect } from "react";
import Burger from "../../components/Burger/Burger";
import BuildControls from "../../components/Burger/BuildControls/BuildControls";
import Modal from "../../components/UI/Modal/Modal";
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary";
import axios from "../../axios-orders";
import Spinner from "../../components/UI/Spinner/Spinner";
import withErrorHandler from "../withErrorHandler/withErrorHandler";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../store/actions/index";

const BurgerBuilder = (props) => {
  const [state, setState] = useState({
    purchasable: false,
    purchasing: false,
  });

  const dispatch = useDispatch();
  const onIngredientAdded = (ingName) =>
    dispatch(actions.addIngredient(ingName));
  const onIngredientRemoved = (ingName) =>
    dispatch(actions.removeIngredient(ingName));
  const initIngredients = () => dispatch(actions.initIngredients());
  const initPurchase = () => dispatch(actions.purchaseInit());
  const onSetAuthRedirectPath = (path) =>
    dispatch(actions.setAuthRedirectionPath(path));

  const ings = useSelector((state) => state.burgerBuilder.ingredients);
  const price = useSelector((state) => state.burgerBuilder.totalPrice);
  const error = useSelector((state) => state.burgerBuilder.error);
  const isAuth = useSelector((state) => state.auth.token !== null);

  useEffect(initIngredients, []);

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

  const disabledInfo = { ...ings };
  for (let key in disabledInfo) {
    disabledInfo[key] = disabledInfo[key] <= 0;
  }

  const updatePurchasing = () => {
    if (isAuth) {
      setState((prevState) => {
        return { ...prevState, purchasing: true };
      });
    } else {
      onSetAuthRedirectPath("/checkout");
      props.history.push("/Auth");
    }
  };

  const removePurchasing = () => {
    setState((prevState) => {
      return { ...prevState, purchasing: false };
    });
  };

  const continueOrderHandle = () => {
    initPurchase();
    props.history.push("./checkout");
  };

  const orderSummary =
    ings === null ? (
      <Spinner />
    ) : (
      <OrderSummary
        ingredients={ings}
        cancelOrder={removePurchasing}
        continueOrder={continueOrderHandle}
        price={price}
      />
    );

  const burger = error ? (
    <p>Ingredients can't be loaded...</p>
  ) : ings === null ? (
    <Spinner />
  ) : (
    <Fragment>
      <Burger ingredients={ings} />
      <BuildControls
        addIngredient={onIngredientAdded}
        removeIngredient={onIngredientRemoved}
        disabledInfo={disabledInfo}
        purchasable={updatePurchaseState(ings)}
        order={updatePurchasing}
        price={price}
        isAuth={isAuth}
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

export default withErrorHandler(BurgerBuilder, axios);
