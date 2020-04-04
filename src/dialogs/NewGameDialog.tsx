import * as React from 'react';
import Modal from 'react-modal';
import Stone from '../components/Stone';
import * as constants from '../common/Constants';
import i18n from '../i18n';
import * as jQuery from 'jquery';
import { littleBox } from './Styles';
import UserPreferences from '../common/UserPreferences';

interface NewGameDialogProps {
    onCancel?: () => void,
    onOk?: (NewGameDialogStates) => void,
    isOpen?: boolean,

    enableSize?: boolean;
    enableStone?: boolean;
}

export interface NewGameDialogStates {
    selectedColor: constants.StoneColor;
    komi: number,
    handicap: number,
    time: number,
    size: number,
    engine: string;
    boardSize: number;
}

export default class NewGameDialog extends React.Component<NewGameDialogProps, NewGameDialogStates> {

    constructor(props: NewGameDialogProps, ctx: any) {
        super(props, ctx);

        let preferences = localStorage.getItem('newgame');
        let defaultPreference: any = { selectedColor: "B", komi: UserPreferences.komi || 7.5, handicap: 0, time: 120, engine: 'KataGo', boardSize: 19 };

        try {
            let pref = preferences ? JSON.parse(preferences) : defaultPreference;
            pref.boardSize = pref.boardSize || 19;
            this.state = pref;
        } catch (error) {
            this.state = defaultPreference;
        }
    }

    componentDidMount() {
    }

    savePreferences() {
        localStorage.setItem('newgame', JSON.stringify(this.state));
    }

    render() {
        return (
            <Modal isOpen={this.props.isOpen} style={littleBox} shouldCloseOnOverlayClick={true}>
                <form className="uk-form-stacked">
                    <legend className="uk-legend">{i18n.dialogs.newgame.title}</legend>

                    {this.props.enableStone ?
                        <div className="uk-margin">
                            <label className="uk-form-label">{i18n.dialogs.newgame.yourColor}:</label>
                            <div className="full-width" uk-form-custom="target: > * > span.selected-text">
                                <select style={{ width: '100%' }} onChange={e => this.setState({ selectedColor: e.target.value as constants.StoneColor })} defaultValue={this.state.selectedColor}>
                                    <option value="B">{i18n.dialogs.newgame.black}</option>
                                    <option value="W">{i18n.dialogs.newgame.white}</option>
                                </select>
                                <button className="uk-button uk-button-default" type="button" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', alignContent: 'center' }} >
                                    <Stone className='inline-block' style={{ color: this.state.selectedColor == "B" ? constants.BlackStoneColor : constants.WhiteStoneColor, width: 18, height: 18, top: 0, right: 0, bottom: 0, left: 0, position: 'relative', margin: '0 4px' }} />
                                    <span className="selected-text"></span>
                                    <span uk-icon="icon: chevron-down" className='inline-block'></span>
                                </button>
                            </div>
                        </div>
                        : undefined
                    }

                    {this.props.enableSize ?
                        <div className="uk-margin">
                            <label className="uk-form-label">{i18n.dialogs.newgame.boardSize}:</label>
                            <div className="uk-form-controls">
                                <input className="uk-input" type="number" placeholder="19" defaultValue={(this.state.boardSize || 19).toString()} onChange={e => this.setState({ boardSize: Math.min(19, Math.max(e.target.valueAsNumber || 19, 7)) })} />
                            </div>
                        </div>
                        : undefined
                    }

                    <div className="uk-margin">
                        <label className="uk-form-label">{i18n.dialogs.newgame.engine}:</label>
                        <div className="full-width" uk-form-custom="target: > * > span.selected-text">
                            <select style={{ width: '100%' }} onChange={e => this.setState({ engine: e.target.value })} defaultValue={this.state.engine}>
                                <option value="KataGo">{'KataGo'}</option>
                                <option value="Leela">{'Leela'}</option>
                                {/* <option value="Leela">{'Leela-Zero'}</option> */}
                            </select>
                            <button className="uk-button uk-button-default" type="button" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', alignContent: 'center' }} >
                                <span className="selected-text"></span>
                                <span uk-icon="icon: chevron-down"></span>
                            </button>
                        </div>
                    </div>

                    <div className="uk-margin">
                        <label className="uk-form-label">{i18n.dialogs.newgame.komi}:</label>
                        <div className="uk-form-controls">
                            <input className="uk-input" type="number" placeholder="6.5" defaultValue={this.state.komi.toString()} onChange={e => this.setState({ komi: e.target.valueAsNumber || 6.5 })} />
                        </div>
                    </div>

                    <div className="uk-margin">
                        <label className="uk-form-label">{i18n.dialogs.newgame.handicap}:</label>
                        <div className="uk-form-controls">
                            <input className="uk-input" type="number" placeholder="0" max={9} defaultValue={this.state.handicap.toString()} onChange={e => this.setState({ handicap: e.target.valueAsNumber || 0 })} />
                        </div>
                    </div>

                    <div className="uk-margin">
                        <label className="uk-form-label">{i18n.dialogs.newgame.time}:</label>
                        <div className="uk-form-controls">
                            <input className="uk-input" type="number" placeholder="200" defaultValue={this.state.time.toString()} onChange={e => this.setState({ time: e.target.valueAsNumber || 120 })} />
                        </div>
                    </div>


                    <div style={{ height: 1, width: '100%', backgroundColor: '#eee', marginBottom: 12 }} />

                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <button className="uk-button uk-button-default" type="button" style={{ width: '48%', }} onClick={e => this.props.onCancel ? this.props.onCancel() : undefined}>
                            {i18n.button.cancel}
                        </button>
                        <button className="uk-button uk-button-primary" type="button" style={{ width: '48%', }} onClick={e => { this.props.onOk ? this.props.onOk(this.state) : undefined; this.savePreferences() }}>
                            {i18n.button.ok}
                        </button>
                    </div>
                </form>
            </Modal>
        );
    }
}