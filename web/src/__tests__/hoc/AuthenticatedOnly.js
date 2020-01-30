/*
Copyright 2019 Province of British Columbia

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at 

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

Created by Patrick Simonian
*/
import { AuthenticatedOnly } from '../../hoc/AuthenticatedOnly';
import React from 'react';
import { shallow } from 'enzyme';

describe('withAuthentication', () => {
  it('returns a component when authenticated', () => {
    const component = <p>hello world</p>;
    const wrapper = shallow(<AuthenticatedOnly authenticated>{component}</AuthenticatedOnly>);
    const para = wrapper.find('p');
    expect(para.text()).toBe('hello world');
  });

  it('returns a redirect component when not authenticated', () => {
    const component = <p>hello world</p>;
    const wrapper = shallow(<AuthenticatedOnly>{component}</AuthenticatedOnly>);
    const para = wrapper.find('p');
    expect(para.length).toBe(0);
    expect(wrapper.text()).toBe('<Redirect />');
  });
});
