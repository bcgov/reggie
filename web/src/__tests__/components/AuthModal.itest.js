import React from 'react';
import { shallow } from 'enzyme';
import { AuthModal } from '../../components/Auth/AuthModal';

describe('AuthButton Component', () => {
  it('matches snapshot when Logged in', () => {
    const authState = true;
    const wrapper = shallow(<AuthModal isAuthenticated={authState} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('matches snapshot when Logged out', () => {
    const authState = false;
    const wrapper = shallow(<AuthModal isAuthenticated={authState} />);
    expect(wrapper).toMatchSnapshot();
  });
});
