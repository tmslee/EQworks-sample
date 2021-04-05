import {useEffect, useState} from "react";

/*
line or bar
which data are we displaying
daily or hourly
start and end
normalize or not
*/
const initialParams = {
  type: 'line',
  data: {},
  includedData: {
    events: false,
    impressions: false,
    clicks: false,
    revenue: false
  },
  interval: 'daily',
  start: null,
  end: null,
  normalize: false
}

const useGraphParams = function (data) {
  const [params, setParams] = useState(initialParams);

  useEffect(() => {
    if(data) {
      setParams({...initialParams, data});
      // set data and start day and end day
    } else {
      setParams({...initialParams});
    }
  }, [data]);

  return {
    params,
    setParams
  };
};

export default useGraphParams;