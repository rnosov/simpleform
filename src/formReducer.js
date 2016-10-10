/*
 * SimpleForm Redux Reducer
 *
 * Copyright © Roman Nosov 2016
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

export default function(state = {}, action) {
  switch (action.type){
    case 'simpleform/checkout/ORDER_FILL': return {
      ...state,
      checkout: {
        ...state.checkout,
        order: action.order,
      },
    };
    case 'simpleform/SET_STATUS': return {
      ...state,
      [action.formType]: {
        ...state[action.formType],
        status: action.status,
        msg: action.msg,
        spinner: action.spinner,
      },
    };
  }
  return state;
};
