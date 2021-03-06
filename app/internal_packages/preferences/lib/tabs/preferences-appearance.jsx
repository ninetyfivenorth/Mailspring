import React from 'react';
import PropTypes from 'prop-types';
import { RetinaImg, Flexbox } from 'mailspring-component-kit';

class AppearanceScaleSlider extends React.Component {
  static displayName = 'AppearanceScaleSlider';

  static propTypes = {
    id: PropTypes.string,
    config: PropTypes.object.isRequired,
  };

  constructor(props) {
    super();
    this.kp = `core.workspace.interfaceZoom`;
    this.state = { value: props.config.get(this.kp) };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ value: nextProps.config.get(this.kp) });
  }

  render() {
    return (
      <div id={this.props.id} className="appearance-scale-slider">
        <div className="ruler">
          <div style={{ flex: 1.02 }}>
            <RetinaImg name="appearance-scale-small.png" mode={RetinaImg.Mode.ContentDark} />
          </div>
          <div className="midpoint" />
          <div style={{ flex: 2, textAlign: 'right' }}>
            <RetinaImg name="appearance-scale-big.png" mode={RetinaImg.Mode.ContentDark} />
          </div>
        </div>
        <input
          type="range"
          min={0.8}
          max={1.4}
          step={0.05}
          value={this.state.value}
          onChange={e => this.props.config.set(this.kp, e.target.value)}
        />
      </div>
    );
  }
}

class AppearanceModeSwitch extends React.Component {
  static displayName = 'AppearanceModeSwitch';

  static propTypes = {
    id: PropTypes.string,
    config: PropTypes.object.isRequired,
  };

  constructor(props) {
    super();
    this.state = {
      value: props.config.get('core.workspace.mode'),
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      value: nextProps.config.get('core.workspace.mode'),
    });
  }

  _onApplyChanges = () => {
    AppEnv.commands.dispatch(`application:select-${this.state.value}-mode`);
  };

  _renderModeOptions() {
    return ['list', 'split'].map(mode => (
      <AppearanceModeOption
        mode={mode}
        key={mode}
        active={this.state.value === mode}
        onClick={() => this.setState({ value: mode })}
      />
    ));
  }

  render() {
    const hasChanges = this.state.value !== this.props.config.get('core.workspace.mode');
    let applyChangesClass = 'btn';
    if (!hasChanges) applyChangesClass += ' btn-disabled';

    return (
      <div id={this.props.id} className="appearance-mode-switch">
        <Flexbox direction="row" style={{ alignItems: 'center' }} className="item">
          {this._renderModeOptions()}
        </Flexbox>
        <div className={applyChangesClass} onClick={this._onApplyChanges}>
          Apply Layout
        </div>
      </div>
    );
  }
}

const AppearanceModeOption = function AppearanceModeOption(props) {
  let classname = 'appearance-mode';
  if (props.active) classname += ' active';

  const label = {
    list: 'Single Panel',
    split: 'Two Panel',
  }[props.mode];

  return (
    <div className={classname} onClick={props.onClick}>
      <RetinaImg name={`appearance-mode-${props.mode}.png`} mode={RetinaImg.Mode.ContentIsMask} />
      <div>{label}</div>
    </div>
  );
};
AppearanceModeOption.propTypes = {
  mode: PropTypes.string.isRequired,
  active: PropTypes.bool,
  onClick: PropTypes.func,
};

class PreferencesAppearance extends React.Component {
  static displayName = 'PreferencesAppearance';

  static propTypes = {
    config: PropTypes.object,
    configSchema: PropTypes.object,
  };

  onClick = () => {
    AppEnv.commands.dispatch('window:launch-theme-picker');
  };

  render() {
    return (
      <div className="container-appearance">
        <h6 htmlFor="change-layout">Layout</h6>
        <AppearanceModeSwitch id="change-layout" config={this.props.config} />
        <h6 htmlFor="change-layout">Theme and Style</h6>
        <div>
          <button className="btn btn-large" onClick={this.onClick}>
            Change theme...
          </button>
        </div>
        <h6 htmlFor="change-scale">Scaling</h6>
        <AppearanceScaleSlider id="change-scale" config={this.props.config} />
        <div className="platform-note">
          Scaling adjusts the entire UI, including icons, dividers, and text. Messages you send will
          still have the same font size. Decreasing scale significantly may make dividers and icons
          too small to click.
        </div>
      </div>
    );
  }
}

export default PreferencesAppearance;
