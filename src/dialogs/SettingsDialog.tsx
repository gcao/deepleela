import * as React from 'react';
import Modal from 'react-modal';
import Stone from '../components/Stone';
import * as constants from '../common/Constants';
import ThemeManager from '../common/ThemeManager';
import i18n from '../i18n';
import * as jQuery from 'jquery';
import { littleBox, tinyBox } from './Styles';
import './Styles.css';
import UserPreferences from '../common/UserPreferences';

interface SettingsDialogProps {
    isOpen?: boolean;
    onOk?: () => void;
}

interface SettingsDialogStates {
    theme?: string;
    winrateMode?: string;
}

export default class SettingsDialog extends React.Component<SettingsDialogProps, SettingsDialogStates>{

    state = { theme: ThemeManager.default.theme, winrateMode: UserPreferences.instance.winrateBlackOnly ? '1' : '' };

    private onThemesChange(value: string) {
        this.setState({ theme: value });
        ThemeManager.default.applyTheme(value);

        if (this.state.theme === value) return;
        this.forceUpdate();
    }

    private onWinrateModeChange(value: string) {
        this.setState({ winrateMode: value });
        UserPreferences.instance.winrateBlackOnly = value ? true : false;
    }

    render() {
        return (
            <Modal isOpen={this.props.isOpen} style={littleBox}>
                <form className="uk-form-stacked">
                    <legend className="uk-legend">{i18n.dialogs.settings.title}</legend>

                    <div className="uk-margin">
                        <label className="uk-form-label">{i18n.dialogs.settings.themes}:</label>
                        <div className="full-width" uk-form-custom="target: > * > span.selected-text">
                            <select style={{ width: '100%' }} onChange={e => this.onThemesChange(e.target.value)} defaultValue={this.state.theme}>
                                <option value="default">{i18n.dialogs.settings.theme_default}</option>
                                <option value="sublime-vivid">{i18n.dialogs.settings.theme_sublime_vivid}</option>
                                <option value="skyblue">{i18n.dialogs.settings.theme_sky_blue}</option>
                                <option value="timber">{i18n.dialogs.settings.theme_timber}</option>
                                <option value="purpink">{i18n.dialogs.settings.theme_purpink}</option>
                            </select>
                            <button className="uk-button uk-button-default" type="button" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
                                <span className="selected-text"></span>
                            </button>
                        </div>
                    </div>

                    <div className="uk-margin">
                        <label className="uk-form-label">{i18n.dialogs.settings.winrate}:</label>
                        <div className="full-width" uk-form-custom="target: > * > span.selected-text">
                            <select style={{ width: '100%' }} onChange={e => this.onWinrateModeChange(e.target.value)} defaultValue={this.state.winrateMode}>
                                <option value={''}>{i18n.dialogs.settings.winrate_both}</option>
                                <option value={'1'}>{i18n.dialogs.settings.winrate_blackOnly}</option>
                            </select>
                            <button className="uk-button uk-button-default" type="button" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', alignContent: 'center' }} >
                                <span className="selected-text"></span>
                            </button>
                        </div>
                    </div>

                    <div style={{ height: 1, width: '100%', backgroundColor: '#eee', marginBottom: 12 }} />

                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <button className="uk-button uk-button-primary" type="button" style={{ width: '100%', }} onClick={e => this.props.onOk ? this.props.onOk() : undefined}>
                            {i18n.button.ok}
                        </button>
                    </div>
                </form>
            </Modal >
        );
    }
}