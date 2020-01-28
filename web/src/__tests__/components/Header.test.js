import React from 'react';
import { shallow } from 'enzyme';
import { Header } from '../../components/UI/Header';

describe('Header Component', () => {
  it('matches snapshot when authenticated', () => {
    const authentication = { isAuthenticated: true };
    const wrapper = shallow(<Header authentication={authentication} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('matches snapshot when NOT authenticated', () => {
    const authentication = { isAuthenticated: false };
    const wrapper = shallow(<Header authentication={authentication} />);
    expect(wrapper).toMatchSnapshot();
  });
});
