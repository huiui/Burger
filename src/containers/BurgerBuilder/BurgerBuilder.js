import React, { Fragment, useState } from "react";
import Burger from "../../components/Burger/Burger";
import BuildControls from "../../components/Burger/BuildControls/BuildControls";
import Modal from "../../components/UI/Modal/Modal";
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary";

const INGREDIENT_PRICES = {
  salad: 0.5,
  cheese: 0.4,
  meat: 1.3,
  bacon: 0.7,
};

const BurgerBuilder = () => {
  const [state, setState] = useState({
    ingredients: {
      salad: 0,
      bacon: 0,
      cheese: 0,
      meat: 0,
    },
    totalPrice: 4,
    purchasable: false,
    purchasing: false,
  });

  const updatePurchaseState = (ingredients) => {
    const sum = Object.keys(ingredients)
      .map((igKey) => {
        return ingredients[igKey];
      })
      .reduce((sum, el) => {
        return sum + el;
      }, 0);
    setState((prevSate) => {
      return { ...prevSate, purchasable: sum > 0 };
    });
  };

  const addIngredientHandle = (type) => {
    const oldCount = state.ingredients[type];
    const oldPrice = state.totalPrice;
    const updatedCounted = oldCount + 1;
    const updatedPrice = oldPrice + INGREDIENT_PRICES[type];
    const newIngredients = { ...state.ingredients, [type]: updatedCounted };
    setState((prevState) => {
      return {
        ...prevState,
        ingredients: newIngredients,
        totalPrice: updatedPrice,
      };
    });
    updatePurchaseState(newIngredients);
  };

  const removeIngredientHandle = (type) => {
    const oldCount = state.ingredients[type];
    if (oldCount <= 0) {
      return;
    }
    const oldPrice = state.totalPrice;
    const updatedCounted = oldCount - 1;
    const updatedPrice = oldPrice - INGREDIENT_PRICES[type];
    const newIngredients = { ...state.ingredients, [type]: updatedCounted };
    setState((prevState) => {
      return {
        ...prevState,
        ingredients: newIngredients,
        totalPrice: updatedPrice,
      };
    });
    updatePurchaseState(newIngredients);
  };

  const disabledInfo = { ...state.ingredients };
  for (let key in disabledInfo) {
    disabledInfo[key] = disabledInfo[key] <= 0;
  }

  const updatePurchasing = () => {
    setState((prevState) => {
      return { ...prevState, purchasing: true };
    });
  };

  const removePurchasing = () => {
    setState((prevState) => {
      return { ...prevState, purchasing: false };
    });
  };

  const continueOrderHandle = () => {
    alert("Continue!");
  }

  return (
    <Fragment>
      <Modal show={state.purchasing} cancelModal={removePurchasing}>
        <OrderSummary ingredients={state.ingredients} cancelOrder={removePurchasing} continueOrder={continueOrderHandle} price={state.totalPrice}/>
      </Modal>
      <Burger ingredients={state.ingredients} />
      <BuildControls
        addIngredient={addIngredientHandle}
        removeIngredient={removeIngredientHandle}
        disabledInfo={disabledInfo}
        purchasable={state.purchasable}
        order={updatePurchasing}
        price={state.totalPrice}
      />
    </Fragment>
  );
};

export default BurgerBuilder;
