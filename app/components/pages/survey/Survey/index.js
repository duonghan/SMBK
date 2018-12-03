/**
 * Author: Duong Han
 * HUST
 * Survey
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
// import styled from 'styled-components';
import axios from 'axios';
import Helmet from 'react-helmet';

import {
  Row,
  Col,
  BackTop,
  Spin,
  Collapse,
  Button,
  Progress,
  Affix,
} from 'antd';
import config from 'utils/validation/config';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import QuestionGroup from '../QuestionGroup';

const { Panel } = Collapse;

/* eslint-disable react/prefer-stateless-function */
class Survey extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      groups: [],
      percent: 0,
      loading: true,
      surveyTitle: '',
      surveyDescription: '',
      activeKey: '0',
    };
  }

  componentDidMount() {
    this.getCurrentSurveyName(this.props.location.state.surveyId);
    this.fetchQuestionGroups(this.props.location.state.surveyId);

    this.props.initResponse({
      surveyId: this.props.location.state.surveyId,
      userId: this.props.userId,
    });

    this.props.setCurrentProfile(this.props.location.state.profileId);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      percent: Math.round(
        (nextProps.response.get('answers').size /
          this.props.response.get('total')) *
          100,
      ),
    });
  }

  fetchQuestionGroups = surveyId => {
    axios
      .get(`/api/survey/question-groups/list/${surveyId}`, config)
      .then(res => {
        this.setState({
          groups: res.data.filter(item => !item.parent),
          loading: false,
        });
      })
      .catch(errors => console.log(errors));
  };

  getCurrentSurveyName = surveyId => {
    axios.get(`/api/survey?id=${surveyId}`, config).then(res => {
      this.setState({
        surveyTitle: res.data.title,
        surveyDescription: res.data.description,
      });
    });
  };

  onChange = key => {
    this.setState({ activeKey: key });
  };

  render() {
    return (
      <Row>
        <Spin spinning={this.state.loading}>
          <Helmet title={this.state.surveyTitle} />
          <Affix>
            <Progress percent={this.state.percent} status="active" />
          </Affix>
          <Col
            md={{ span: 14, offset: 5 }}
            sm={{ span: 20, offset: 2 }}
            xs={24}
            style={{
              border: '1px solid black',
              borderRadius: 5,
              padding: 20,
              backgroundColor: 'white',
              minHeight: window.innerHeight,
            }}
          >
            <h1 style={{ textAlign: 'center' }}>
              {this.state.surveyTitle.toUpperCase()}
            </h1>
            <br />
            <h4 style={{ textAlign: 'center' }}>
              <i>{this.state.surveyDescription}</i>
            </h4>
            {this.state.groups.length > 1
              ? this.state.groups.map((item, index) => (
                  <Collapse
                    accordion
                    activeKey={this.state.activeKey}
                    bordered={false}
                    defaultActiveKey="0"
                    onChange={this.onChange}
                    key={index}
                  >
                    <Panel key={item._id} header={`${index + 1}. ${item.name}`}>
                      {item.childs && item.childs.length > 0 ? (
                        item.childs.map((leaf, i) => (
                          <Collapse
                            bordered={false}
                            defaultActiveKey="0"
                            key={leaf._id}
                          >
                            <Panel
                              key={`${index}_${i}`}
                              header={`${index + 1}.${i + 1}. ${leaf.name}`}
                            >
                              <QuestionGroup
                                group={leaf}
                                prefix={`${index + 1}.${i + 1}`}
                              />
                            </Panel>
                          </Collapse>
                        ))
                      ) : (
                        <QuestionGroup group={item} prefix={`${index + 1}`} />
                      )}
                    </Panel>
                  </Collapse>
                ))
              : this.state.groups.map((item, index) => (
                  <QuestionGroup group={item} key={index} />
                ))}
            <Button
              type="primary"
              style={{ marginTop: 20 }}
              onClick={() => this.props.submitResponse(this.props.response)}
            >
              <FormattedMessage {...messages.submitBtn} />
            </Button>
          </Col>

          <BackTop />
        </Spin>
      </Row>
    );
  }
}

Survey.propTypes = {
  initResponse: PropTypes.func.isRequired,
  submitResponse: PropTypes.func.isRequired,
  setCurrentProfile: PropTypes.func.isRequired,
  userId: PropTypes.string.isRequired,
  response: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
};

export default Survey;
