import * as React from 'react';
import * as jQuery from 'jquery';
import './Styles.css';
import i18n from '../i18n';
import SGF from '../common/SGF';
import * as constants from '../common/Constants';
import { State } from '../components/Intersection';
import { CSSProperties } from 'react';
import { StoneColor } from '../common/Constants';
import GameClient from '../common/GameClient';
import Board from '../components/Board';
import { GameMode } from './SmartGoBoard';
import BrowserHelper from '../components/BrowserHelper';

interface BoardControllerProps {
    mode?: GameMode;
    style?: CSSProperties;
    showAnalytics?: boolean;
    onAIThinkingClick?: () => void;
    onAIAutoPlayClick?: (autoplay: boolean) => void;
    onCursorChange?: (delta: number) => void;
    onExitBranch?: () => void;
    onAnalyticsClick?: () => void;
}

interface BoardControllerStates {
    autoplay: boolean;
    expanded?: boolean;
    branchMode?: boolean;
}

export default class BoardController extends React.Component<BoardControllerProps, BoardControllerStates> {

    state: BoardControllerStates = { autoplay: false };

    private sgf: string;
    private expandTimerId: NodeJS.Timer;
    private boardSize: number;
    private snapshots: State[][][] = [];
    private arrayCoords: { x: number, y: number }[] = [];
    private stonesColor: StoneColor[] = [];
    private root: HTMLDivElement;

    componentDidMount() {
        this.root = document.getElementById('board-controller') as HTMLDivElement;
        this.calcPos();
        jQuery(window).on('resize', this.calcPos);
    }

    componentWillUnmount() {
        clearTimeout(this.expandTimerId);
        jQuery(window).off('resize', this.calcPos);
    }

    calcPos = () => {
        let fx = Math.max(0, window.innerWidth - 32);
        let fy = Math.max(0, window.innerHeight - 50 - 52);
        jQuery('#board-controller').css('left', fx).css('top', fy);
    }

    private onAIClick() {
        if (this.props.mode === 'self') {
            if (this.props.onAIAutoPlayClick) this.props.onAIAutoPlayClick(!this.state.autoplay);
            this.setState({ autoplay: !this.state.autoplay });
            return;
        }

        if (!this.props.onAIThinkingClick) return;
        this.props.onAIThinkingClick();
    }

    private triggerCursorChange(delta: number) {
        if (!this.props.onCursorChange) return;
        this.props.onCursorChange(delta);
    }

    private expandSelf() {
        clearTimeout(this.expandTimerId);
        if (this.state.expanded) return;

        this.setState({ expanded: true });

        let rect = this.root.getBoundingClientRect();
        jQuery('#board-controller').animate({ left: window.innerWidth - rect.width - 12, });
        jQuery(window).off('resize', this.calcPos);
    }

    private shrinkSelf(immediately = false) {
        clearTimeout(this.expandTimerId);
        this.expandTimerId = setTimeout(() => {
            this.setState({ expanded: false });
            jQuery('#board-controller').animate({ left: window.innerWidth - 36 });
            jQuery(window).on('resize', this.calcPos);
        }, immediately ? 0 : (this.props.mode === 'review' ? 180 : 60) * 1000);
    }

    private toggleSelf() {
        this.state.expanded ? this.shrinkSelf(true) : this.expandSelf();
    }

    componentDidUpdate() {
        if (!this.props.onAIAutoPlayClick) return;

        if (this.props.mode !== 'self' && this.state.autoplay) {
            this.props.onAIAutoPlayClick(false);
            this.setState({ autoplay: false });
        }
    }

    enterBranchMode() {
        this.setState({ branchMode: true });
    }

    exitBranchMode() {
        this.setState({ branchMode: false });
    }

    private triggerExitBranchMode() {
        if (this.state.branchMode && this.props.onExitBranch) this.props.onExitBranch();
        this.setState({ branchMode: false });
    }

    render() {
        let isReview = this.props.mode && this.props.mode === 'review';

        return (
            <div id='board-controller' style={this.props.style} className='shadow-controller blur' onMouseLeave={e => this.shrinkSelf()} onMouseEnter={e => clearTimeout(this.expandTimerId)}>
                <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', alignContent: 'center', background: `rgba(255, 255, 255, ${BrowserHelper.isSafari ? 0.15 : 0.45})`, userSelect: 'none', }}>
                    <div id='draggable-handler' className='center-div' onMouseEnter={e => this.expandSelf()} onClick={e => this.toggleSelf()} style={{ background: 'transparent', height: 52, }}>
                        <span uk-icon='icon: more-vertical; ratio: 1' style={{ display: 'inline-block', paddingLeft: 10 }}></span>
                    </div>
                    <div className='touch' uk-tooltip={i18n.tips.backward} onClick={e => this.triggerCursorChange(-10)}>
                        <span uk-icon='icon:  chevron-left; ratio: 1;'></span>
                        <span uk-icon='icon:  chevron-left; ratio: 1.2' style={{ display: 'inline-block', marginLeft: -16 }}></span>
                    </div>
                    <div className='touch' style={{ paddingTop: 2 }} uk-tooltip={i18n.tips.previous} onClick={e => this.triggerCursorChange(-1)}>
                        <span uk-icon='icon: arrow-left; ratio: 1.35'></span>
                    </div>
                    <div className='touch' uk-tooltip={i18n.tips.aithingking} onClick={e => this.onAIClick()}>
                        <span style={{ fontWeight: 800, fontSize: 19, marginTop: 3, display: 'block', fontFamily: 'sans-serif', color: this.state.autoplay && this.props.mode === 'self' ? 'deepskyblue' : constants.BlackStoneColor, transition: 'all 0.5s' }}>AI</span>
                    </div>
                    <div className='touch' style={{ paddingTop: 2 }} uk-tooltip={i18n.tips.next} onClick={e => this.triggerCursorChange(1)}>
                        <span uk-icon='icon: arrow-right; ratio: 1.35'></span>
                    </div>
                    <div className='touch' uk-tooltip={i18n.tips.forward} onClick={e => this.triggerCursorChange(10)}>
                        <span uk-icon='icon:  chevron-right; ratio: 1.2' style={{ display: 'inline-block', marginRight: -16 }}></span>
                        <span uk-icon='icon:  chevron-right; ratio: 1'></span>
                    </div>

                    {isReview ?
                        <div className='touch' uk-tooltip={i18n.tips.branch} onClick={e => this.triggerExitBranchMode()}>
                            <span uk-icon='icon: minus-circle; ratio: 0.95' style={{ display: 'inline-block', marginLeft: -16, marginTop: 2, color: this.state.branchMode ? 'deepskyblue' : 'lightgrey' }}></span>
                        </div> : undefined
                    }

                    {isReview && this.props.showAnalytics ?
                        <div className='touch' uk-tooltip={i18n.tips.anayltics} onClick={e => this.props.onAnalyticsClick && this.props.onAnalyticsClick()}>
                            <span uk-icon='icon: nut; ' style={{ display: 'inline-block', marginLeft: -32, marginTop: 2, }}></span>
                        </div> : undefined
                    }
                </div>
            </div>
        );
    }
}