import React, {useEffect, useState} from 'react';

export default function MainGraph (props) {
  const {params} = props;
  const {
    type,
    includedData,
    data,
    interval,
    start,
    end,
    normalize,
  } = params;

  return (
    <p>graph goes here</p>
  );
} ;