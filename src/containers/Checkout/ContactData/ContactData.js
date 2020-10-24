import React, { useState } from "react";
import Button from "../../../components/UI/Button/Button";
import styles from "./ContactData.module.css";
import axios from "../../../axios-orders";
import Spinner from "../../../components/UI/Spinner/Spinner";

const ContactData = (props) => {
  const [state, setState] = useState({
    name: "",
    email: "",
    address: {
      street: "",
      postalCode: "",
    },
    loading: false,
  });

  const OrderHandler = (event) => {
    event.preventDefault();
    console.log(props);
    setState((prevState) => {
      return { ...prevState, loading: true };
    });
    const order = {
      ingredients: props.ingredients,
      price: props.price,
      customer: {
        name: "Max Mad",
        address: {
          street: "Teststreet 1",
          zipCode: "41351",
          country: "Germany",
        },
        email: "test@test.com",
      },
      deliveryMethod: "fastest",
    };
    axios
      .post("/orders.json", order)
      .then((rsp) => {
        setState((prevState) => {
          return { ...prevState, loading: false };
          
        });
        props.history.push('/');
      })
      .catch((error) => {
        setState((prevState) => {
          return { ...prevState, loading: false };
        });
      });
  };
  let form = (
    <form>
      <input
        className={styles.Input}
        type="text"
        name="name"
        placeholder="Your Name"
      />
      <input
        className={styles.Input}
        type="email"
        name="email"
        placeholder="Your Mail"
      />
      <input
        className={styles.Input}
        type="text"
        name="street"
        placeholder="Street"
      />
      <input
        className={styles.Input}
        type="text"
        name="postal"
        placeholder="Postal Code"
      />
      <Button btnType="Success" clicked={OrderHandler}>
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

export default ContactData;
