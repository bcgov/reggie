import React from 'react';
import { shallow, mount } from 'enzyme';
import { AuthButton } from '../../components/Auth/AuthButton';

describe.skip('AuthButton Component', () => {
  it('matches snapshot when Logged in', () => {
    const authState = true;
    const wrapper = shallow(<AuthButton isAuthenticated={authState} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('matches snapshot when Logged out', () => {
    const authState = false;
    const wrapper = shallow(<AuthButton isAuthenticated={authState} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('redirect to log in url after clicking', () => {
    window.location.assign = jest.fn();
    const authState = false;
    const wrapper = mount(<AuthButton isAuthenticated={authState} />);
    expect(wrapper.prop('isAuthenticated')).toEqual(authState);
    wrapper
      .find('.auth-button')
      .first()
      .simulate('click');
    expect(window.location.assign).toHaveBeenCalled();
  });

  it('redirect to log out url after clicking', () => {
    window.location.assign = jest.fn();
    const authState = true;
    const wrapper = mount(<AuthButton isAuthenticated={authState} />);
    expect(wrapper.prop('isAuthenticated')).toEqual(authState);
    wrapper
      .find('.auth-button')
      .first()
      .simulate('click');
    expect(window.location.assign).toHaveBeenCalled();
  });
});
