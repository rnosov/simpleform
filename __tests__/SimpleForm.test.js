/*
 * SimpleForm Test Suit
 *
 * Copyright © Roman Nosov 2016
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import { mount } from 'enzyme';
import SimpleForm from '../src/SimpleForm';

describe('SimpleForm', () => {
  it('renders a initial view', () => {
    const form = mount(<SimpleForm field1 field2="*" onSubmit={ () => void 0 } />);
    expect(form.html()).toMatchSnapshot();
  });
});
