import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { init } from 'contentful-ui-extensions-sdk';

import Select from 'react-select';
import { components } from 'react-select';
const { SingleValue, Option } = components;

import './index.css';

export class App extends React.Component {
  
  static propTypes = {
    sdk: PropTypes.object.isRequired
  };

  detachExternalChangeHandler = null;

  constructor(props) {
    super(props);

    this.state = {
      value: props.sdk.field.getValue() || null
    };
    
  }

  componentDidMount() {
    this.props.sdk.window.startAutoResizer();
    // Handler for external field value changes (e.g. when multiple authors are working on the same entry).
    this.detachExternalChangeHandler = this.props.sdk.field.onValueChanged(this.onExternalChange);
  }

  componentWillUnmount() {
    if (this.detachExternalChangeHandler) {
      this.detachExternalChangeHandler();
    }
  }

  onExternalChange = value => {
    this.setState({ value })
  }

  onChange = value => {
    // Set state for select field
    this.setState(
      prevState => ({
        ...prevState.value,
        value
      })
    );
    //Set field value
    if ( value != null ){
      this.props.sdk.field.setValue(value);
    }
  };

  render() {

    // Custom constants and functions

    const customSingleValue = (props) => (
      <SingleValue {...props}>
          <i className={ props.data.value + ' select-icon' }></i>
          <span>{ props.data.label }</span>
      </SingleValue>
    );
    
    const customOption = (props) => (
      <Option {...props}>
        <i className={ props.data.value + ' select-icon'}></i>
        <span>{ props.data.label }</span>
      </Option>
    );

    const customStyles = {
      control: (provided) => ({
        ...provided,
        borderRadius: '0px'
      }),
      menu: (provided) => ({
        ...provided,
        borderRadius: '0px'
      }),
    };

    // Properties for select field

    const options = [
      { value: 'ion-ios-monitor-outline', label: 'Monitor' },
      { value: 'ion-ios-settings', label: 'Settings' },
      { value: 'ion-social-googleplus-outline', label: 'Google Plus' },
      { value: 'ion-ios-heart-outline', label: 'Heart' }
    ];

    const props = {
      options: options,
      value: this.state.value,
      placeholder: 'Select an icon...',
      onChange: this.onChange,
      components: { 
        SingleValue: customSingleValue,
        Option: customOption
      },
      styles: customStyles
    }

    // Load select field
    return (
      <Select {...props} />
    );
  }
}

init(sdk => {
  ReactDOM.render(<App sdk={sdk} />, document.getElementById('root'));
});

/**
 * By default, iframe of the extension is fully reloaded on every save of a source file.
 * If you want to use HMR (hot module reload) instead of full reload, uncomment the following lines
 */
// if (module.hot) {
//   module.hot.accept();
// }
