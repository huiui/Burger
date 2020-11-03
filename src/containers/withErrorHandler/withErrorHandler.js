import React, { Fragment, useEffect, useState } from "react";
import Modal from "../../components/UI/Modal/Modal";

const withErrorHandler = (WrappedComponent, axios) => {
  return (props) => {
    const [state, setState] = useState({ error: null });

    const reqInterceptor = axios.interceptors.request.use((req) => {
      setState({ error: null });
      return req;
    });
    const resInterceptor = axios.interceptors.response.use(
      (res) => {
        return res;
      },
      (err) => {
        setState({ error: err });
      }
    );

    useEffect(()=>{
      return () => {
        axios.interceptors.request.eject(reqInterceptor);
        axios.interceptors.response.eject(resInterceptor);
      }
    }, [reqInterceptor,resInterceptor])

    const errorConfirmedHandler = () => {
      setState({ error: null });
    };

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
