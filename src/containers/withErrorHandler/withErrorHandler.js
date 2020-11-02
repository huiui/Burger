import React, { Fragment, useEffect, useState } from "react";
import Modal from "../../components/UI/Modal/Modal";

const withErrorHandler = (WrappedComponent, axios) => {
  return (props) => {
    const [state, setState] = useState({ error: null });

    useEffect(() => {
      axios.interceptors.request.use((req) => {
        //setState({ error: null });
        return req;
      });
      axios.interceptors.response.use(
        (res) => {return res},
        (error) => {
          //console.log(error.response);
          error = error.response.data; 
          //setState((prevState)=>{console.log("set state trigued"); return {...prevState, error: "error.response.data"} });
        }
      );
    }, []);

    const errorConfirmedHandler = () => {
      setState({ error: null });
    };

    //console.log(state);

    return (
      <Fragment>
        <Modal show={state.error} cancelModal={errorConfirmedHandler}>
          {state.error ? state.error : null}
        </Modal>
        <WrappedComponent {...props} />
      </Fragment>
    );
  };
};

export default withErrorHandler;
