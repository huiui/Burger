import React, { Fragment, useState } from "react";
import Burger from "../../components/Burger/Burger";
import BuildControls from "../../components/Burger/BuildControls/BuildControls";
import Modal from "../../components/UI/Modal/Modal";
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary";
import axios from "../../axios-orders";
import Spinner from "../../components/UI/Spinner/Spinner";
import withErrorHandler from "../withErrorHandler/withErrorHandler";
import { connect } from "react-redux";
import * as actionTypes from "../../store/actions";

const BurgerBuilder = (props) => {
  const [state, setState] = useState({
    purchasable: false,
    purchasing: false,
    loading: false,
  });

  // useEffect(() => {
  //   let mounted = true;

  //   axios
  //     .get("https://react-my-burger-6d0c7.firebaseio.com/ingredients.json")
  //     .then((response) => { if (mounted){
  //       setState((prevState) => {
  //         return { ...prevState, ingredients: response.data };
  //       });}
  //     })
  //     .catch((error) => {});

  //   return ()=>{
  //     mounted = false;
  //   }
  // }, []);

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
    for (let i in props.ings) {
      queryParams.push(
        encodeURIComponent(i) + "=" + encodeURIComponent(props.ings[i])
      );
    }
    queryParams.push("price=" + props.price);
    const queryString = queryParams.join("&");
    props.history.push({ pathname: "./checkout", search: "?" + queryString });
  };

  const orderSummary =
    props.ings === null || state.loading ? (
      <Spinner />
    ) : (
      <OrderSummary
        ingredients={props.ings}
        cancelOrder={removePurchasing}
        continueOrder={continueOrderHandle}
        price={props.price}
      />
    );

  const burger =
    props.ings === null ? (
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
    ings: state.ingredients,
    price: state.totalPrice,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    onIngredientAdded: (ingName) =>
      dispatch({ type: actionTypes.ADD_INGREDIENT, ingredientName: ingName }),
    onIngredientRemoved: (ingName) =>
      dispatch({
        type: actionTypes.REMOVE_INGREDIENT,
        ingredientName: ingName,
      }),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandler(BurgerBuilder, axios));
