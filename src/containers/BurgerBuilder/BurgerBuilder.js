import React, { Fragment, useState, useEffect } from "react";
import Burger from "../../components/Burger/Burger";
import BuildControls from "../../components/Burger/BuildControls/BuildControls";
import Modal from "../../components/UI/Modal/Modal";
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary";
import axios from "../../axios-orders";
import Spinner from "../../components/UI/Spinner/Spinner";
import withErrorHandler from "../withErrorHandler/withErrorHandler";

const INGREDIENT_PRICES = {
  salad: 0.5,
  cheese: 0.4,
  meat: 1.3,
  bacon: 0.7,
};

const BurgerBuilder = (props) => {
  const [state, setState] = useState({
    ingredients: null,
    totalPrice: 4,
    purchasable: false,
    purchasing: false,
    loading: false,
  });

  useEffect(() => {
    axios
      .get("https://react-my-burger-6d0c7.firebaseio.com/ingredients.json")
      .then((response) => {
        setState((prevState) => {
          return { ...prevState, ingredients: response.data };
        });
      })
      .catch((error) => {});
  }, []);

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
    const queryParams = [];
    for (let i in state.ingredients) {
      queryParams.push(
        encodeURIComponent(i) + "=" + encodeURIComponent(state.ingredients[i])
      );
    }
    const queryString = queryParams.join("&");
    props.history.push({ pathname: "./checkout", search: "?" + queryString });
    //alert("Continue!");
    // setState((prevState) => {
    //   return { ...prevState, purchasing: true, loading: true };
    // });
    // const order = {
    //   ingredients: state.ingredients,
    //   price: state.totalPrice,
    //   custormer: {
    //     name: "Max Mad",
    //     address: {
    //       street: "Teststreet 1",
    //       zipCode: "41351",
    //       country: "Germany",
    //     },
    //     email: "test@test.com",
    //   },
    //   deliveryMethod: "fastest",
    // };
    // axios
    //   .post("/orders.json", order)
    //   .then((rsp) => {
    //     setState((prevState) => {
    //       return { ...prevState, purchasing: false, loading: false };
    //     });
    //   })
    //   .catch((error) => {
    //     setState((prevState) => {
    //       return { ...prevState, purchasing: false, loading: false };
    //     });
    //   });
  };

  const orderSummary =
    state.ingredients === null || state.loading ? (
      <Spinner />
    ) : (
      <OrderSummary
        ingredients={state.ingredients}
        cancelOrder={removePurchasing}
        continueOrder={continueOrderHandle}
        price={state.totalPrice}
      />
    );

  const burger =
    state.ingredients === null ? (
      <Spinner />
    ) : (
      <Fragment>
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
