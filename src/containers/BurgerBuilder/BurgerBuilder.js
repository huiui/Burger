import React, { Fragment, useState } from "react";
import Burger from "../../components/Burger/Burger";
import BuildControls from "../../components/Burger/BuildControls/BuildControls";

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
}

const BurgerBuilder = () => {
    const [state, setState] = useState({
        ingredients: {
            salad: 0,
            bacon: 0,
            cheese: 0,
            meat: 0
        },
        totalPrice: 4
    })

    const addIngredientHandle = (type) => {
        const oldCount = state.ingredients[type];
        const oldPrice = state.totalPrice;
        const updatedCounted = oldCount + 1;
        const updatedPrice = oldPrice + INGREDIENT_PRICES[type];
        const newIngredients = { ...state.ingredients, [type]: updatedCounted };
        setState({ ingredients: newIngredients, totalPrice: updatedPrice });
    }

    const removeIngredientHandle = (type) => {
        const oldCount = state.ingredients[type];
        if (oldCount <= 0) { return; }
        const oldPrice = state.totalPrice;
        const updatedCounted = oldCount - 1;
        const updatedPrice = oldPrice - INGREDIENT_PRICES[type];
        const newIngredients = { ...state.ingredients, [type]: updatedCounted };
        setState({ ingredients: newIngredients, totalPrice: updatedPrice });
    }

    const disabledInfo = {...state.ingredients};
    for (let key in disabledInfo) {
        disabledInfo[key] = disabledInfo[key] <= 0;
    }

    return (
        <Fragment>
            <Burger ingredients={state.ingredients} />
            <BuildControls addIngredient={addIngredientHandle} removeIngredient={removeIngredientHandle} disabledInfo={disabledInfo} price={state.totalPrice}/>
        </Fragment>
    );
}

export default BurgerBuilder;