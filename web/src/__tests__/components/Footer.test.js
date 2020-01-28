import React from 'react';
import { shallow } from 'enzyme';
import Footer from '../../components/UI/Footer';

describe('Footer Component', () => {
  it('matches snapshot', () => {
    const wrapper = shallow(<Footer />);
    expect(wrapper).toMatchSnapshot();
  });
});
