import {useEffect, useState} from "react";

const useGraphParams = function (initialParams) {
  const [params, setParams] = useState(initialParams);

  return {
    params,
    setParams
  };
};

export default useGraphParams;