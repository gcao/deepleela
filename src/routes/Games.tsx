import * as React from 'react';
import ThemeManager from '../common/ThemeManager';
import BrowserHelper from '../components/BrowserHelper';
import * as jQuery from 'jquery';
import i18n from '../i18n';
import App from '../App';
import model from '../models/modelcao';
import './Style.css';

export default class Games extends React.Component {
    table: HTMLTableElement;
    games: any[] = [];

    constructor(props: any, ctx: any) {
        super(props, ctx);

        model.versions.forEach(version => {
            this.games = this.games.concat(version.games);
        })
    }

    componentDidMount() {
        setImmediate(() => jQuery(window).trigger('resize'));
        this.table = document.getElementById('games-table') as HTMLTableElement;
    }

    openGame(url: string) {
        window.location = `/?action=load&url=${url}&move=0` as any;
    }

    render() {
        let tableWidth = this.table ? this.table.getBoundingClientRect().width : 0;
        return (
            <div style={{ width: '100%', height: '100%', minHeight: '87vh', overflow: 'hidden', position: 'relative', }}>
                <div style={{ display: 'flex', justifyContent: 'center', }}>
                    {/* <div style={{ display: 'block' }}>{model.name} : {model.description}</div> */}
                    <div className='uk-overflow-auto' style={{ minWidth: '80%', display: 'block' }}>
                        <table id='games-table' className="uk-table uk-table-hover uk-table-divider uk-table-small " style={{ fontSize: 12, marginLeft: 14 }}>
                            <thead>
                                <tr>
                                    <th style={{ color: `${ThemeManager.default.logoColor}` }}>{i18n.cgos.black}</th>
                                    <th style={{ color: `${ThemeManager.default.logoColor}` }}>{i18n.cgos.white}</th>
                                    <th style={{ color: `${ThemeManager.default.logoColor}` }}>{i18n.cgos.komi}</th>
                                    <th style={{ color: `${ThemeManager.default.logoColor}` }}>{i18n.cgos.result}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.games.map(m => {
                                    return (
                                        <tr className='uk-animation-fade' key={m.id} style={{ cursor: 'pointer', }} onClick={e => this.openGame(m.sgfUrl)}>
                                            <td>{m.B}</td>
                                            <td>{m.W}</td>
                                            <td>{m.komi}</td>
                                            <td>{m.result}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                      </div>
                </div>
            </div >
        );
    }
}
