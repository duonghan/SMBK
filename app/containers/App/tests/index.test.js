import React from 'react';
import { shallow } from 'enzyme';
import { Route } from 'react-router-dom';
import { Layout } from 'antd';

import MyFooter from 'components/MyFooter';
import App from '../index';

describe('<App />', () => {
  it('should render some routes', () => {
    const renderedComponent = shallow(<App />);
    expect(renderedComponent.find(Route).length).not.toBe(0);
  });

  it('should render with layout', () => {
    const renderedComponent = shallow(<App />);
    expect(renderedComponent.find(Layout).length).not.toBe(0);
  });

  it('should render the footer', () => {
    const renderedComponent = shallow(<App />);
    expect(renderedComponent.find(MyFooter).length).toBe(1);
  });
});
