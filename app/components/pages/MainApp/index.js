/**
 *
 * MainApp
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
// import styled from 'styled-components';

import axios from 'axios';
import { Layout, Row, Col, Pagination, Spin } from 'antd';
import SurveyItem from 'components/pages/survey/SurveyItem';
import { injectIntl, intlShape } from 'react-intl';
import { Helmet } from 'react-helmet';

import messages from './messages';

/* eslint-disable react/prefer-stateless-function */
class MainApp extends React.Component {
  componentWillMount() {
    this.props.fetchSurvey();
  }

  render() {
    const { formatMessage } = this.props.intl;
    return (
      <Layout style={{ margin: 20 }}>
        <Helmet title={formatMessage(messages.header)} />
        <Spin spinning={this.props.loading}>
          <Row gutter={24} type="flex" justify="space-around" align="middle">
            {this.props.surveys &&
              this.props.surveys.map(item => {
                return (
                  <Col
                    className="gutter-row"
                    xs={24}
                    sm={12}
                    md={12}
                    key={item.title}
                  >
                    <SurveyItem {...item} loading={this.props.loading} />
                  </Col>
                );
              })}
          </Row>
        </Spin>
      </Layout>
    );
  }
}

MainApp.propTypes = {
  intl: intlShape.isRequired,
  surveys: PropTypes.object,
  fetchSurvey: PropTypes.func.isRequired,
};

export default injectIntl(MainApp);

// MainApp.propTypes = {
//   token: PropTypes.string,
//   history: PropTypes.object.isRequired,
// };
//
