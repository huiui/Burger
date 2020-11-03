import { useState, useEffect } from "react";

export default (httpClient) => {
  const [error, setState] = useState(null);

  const reqInterceptor = httpClient.interceptors.request.use((req) => {
    setState(null);
    return req;
  });
  const resInterceptor = httpClient.interceptors.response.use(
    (res) => {
      return res;
    },
    (err) => {
      setState(err);
    }
  );

  useEffect(() => {
    return () => {
      httpClient.interceptors.request.eject(reqInterceptor);
      httpClient.interceptors.response.eject(resInterceptor);
    };
  }, [reqInterceptor, resInterceptor, httpClient]);

  const errorConfirmedHandler = () => {
    setState(null);
  };

  return [error, errorConfirmedHandler];
};
