import React, { useState } from "react";
import Button from "../../../components/UI/Button/Button";
import styles from "./ContactData.module.css";
import axios from "../../../axios-orders";
import Spinner from "../../../components/UI/Spinner/Spinner";
import Input from "../../../components/UI/Input/Input";
import {connect} from "react-redux";

const ContactData = (props) => {
  const [state, setState] = useState({
    orderForm: {
      name: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Your Name",
        },
        value: "",
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
      },
      street: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Street",
        },
        value: "",
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
      },
      zipCode: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "ZIP",
        },
        value: "",
        validation: {
          required: true,
          minLength: 5,
          maxLength: 5,
        },
        valid: false,
        touched: false,
      },
      country: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Country",
        },
        value: "",
        validation: {
          required: true,
        },
        valid: false,
      },
      email: {
        elementType: "input",
        elementConfig: {
          type: "email",
          placeholder: "Your Email",
        },
        value: "",
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
      },
      deliveryMethod: {
        elementType: "select",
        elementConfig: {
          options: [
            { value: "fastest", displayValue: "Fastest" },
            { value: "cheapest", displayValue: "Cheapest" },
          ],
        },
        value: "fastest",
        valid: true,
        validation: {},
      },
    },
    formValid: false,
    loading: false,
  });

  const OrderHandler = (event) => {
    event.preventDefault();
    setState((prevState) => {
      return { ...prevState, loading: true };
    });
    const formData = {};
    for (let formElement in state.orderForm) {
      formData[formElement] = state.orderForm[formElement].value;
    }
    const order = {
      ingredients: props.ings,
      price: props.price,
      orderData: formData,
    };
    axios
      .post("/orders.json", order)
      .then((rsp) => {
        setState((prevState) => {
          return { ...prevState, loading: false };
        });
        props.history.push("/");
      })
      .catch((error) => {
        setState((prevState) => {
          return { ...prevState, loading: false };
        });
      });
  };

  const checkValidity = (value, rules) => {
    let isValid = true;
    if (rules.required) {
      isValid = value.trim() !== "" && isValid;
    }
    if (rules.minLength) {
      isValid = value.length >= rules.minLength && isValid;
    }
    if (rules.maxLength) {
      isValid = value.length <= rules.maxLength && isValid;
    }
    return isValid;
  };

  const inputChangeHandler = (event, inputIdentifier) => {
    const updatedOrderForm = state.orderForm;
    const updatedFormElement = updatedOrderForm[inputIdentifier];
    updatedFormElement.value = event.target.value;
    updatedFormElement.valid = checkValidity(
      updatedFormElement.value,
      updatedFormElement.validation
    );
    updatedFormElement.touched = true;
    updatedOrderForm[inputIdentifier] = updatedFormElement;

    let formValid = true;
    for (let key in updatedOrderForm) {
      formValid = updatedOrderForm[key].valid && formValid;
    }
    setState((prevState) => {
      return {
        ...prevState,
        orderForm: updatedOrderForm,
        formValid: formValid,
      };
    });
  };

  const formElementsArray = [];
  for (let key in state.orderForm) {
    formElementsArray.push({
      id: key,
      config: state.orderForm[key],
    });
  }
  let form = (
    <form onSubmit={OrderHandler}>
      {formElementsArray.map((formElement) => {
        return (
          <Input
            key={formElement.id}
            elementType={formElement.config.elementType}
            elementConfig={formElement.config.elementConfig}
            value={formElement.config.value}
            invalid={!formElement.config.valid}
            shouldValidate={formElement.config.validation}
            touched={formElement.config.touched}
            changed={(event) => inputChangeHandler(event, formElement.id)}
          />
        );
      })}
      <Button btnType="Success" disabled={!state.formValid}>
        ORDER
      </Button>
    </form>
  );
  if (state.loading) {
    form = <Spinner />;
  }
  return (
    <div className={styles.ContactData}>
      <h4>Enter your Contact Data</h4>
      {form}
    </div>
  );
};

const mapStateToProps = state => {
  return {
    ings: state.ingredients,
    price: state.totalPrice,
  }
}
export default connect(mapStateToProps)(ContactData);
