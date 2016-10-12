/*
 * RestForm Test Suite
 *
 * Copyright © Roman Nosov 2016
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import { mount } from 'enzyme';
import RestForm from '../src/RestForm';

describe('RestForm', () => {
  it('renders a initial view', () => {
    const form = mount(<RestForm endpoint="" schema={{}} setStatus={ () => void 0 } onResponseReceived={ () => void 0 } />);
    expect(form.html()).toMatchSnapshot();
  });
});
