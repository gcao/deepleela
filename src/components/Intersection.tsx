import * as React from 'react';
import { CSSProperties } from 'react';
import Stone from './Stone';
import './Styles.css';
import BrowserHelper from './BrowserHelper';

export interface WinRate {
    value: number;
    uvalue: number;
    visits: number;
    highest?: boolean;
    weight?: number;
}

interface IntersectionProps {
    width: number;
    lineThickness?: number;
    onTouch?: (x: number, y: number) => void;
    onClick: (row: number, col: number) => void;
    onMouseEnter?: (x: number, y: number) => void;
    onMouseLeave?: (x: number, y: number) => void;
    onVariationHover?: (row: number, col: number) => void;
    onVariationHoverLeave?: (row: number, col: number) => void;
    state: State;
    star: boolean;
    disabled?: boolean;
    highlight?: boolean;
    rightEdge?: boolean;
    leftEdge?: boolean;
    topEdge?: boolean;
    bottomEdge?: boolean;
    row: number;
    col: number;
    style?: CSSProperties & { whiteStoneColor?: string, blackStoneColor?: string, startPointColor?: string, winrateFontColor?: string, winrateBackground?: string };
    highlightPointSize?: 'large' | 'small';
    heatmap?: number;
    winrate?: WinRate;
    moveNumber?: number;
    fontSize?: number;
    needTouchConfirmation?: boolean;
    showTouchConfirmation?: boolean;
    disableAnimation?: boolean;

    // vb: virtual board
    vbSize: number;
    vbOffsetX: number;
    vbOffsetY: number;
}

interface IntersectionStates {
    hover: boolean;
    touchConfirmed?: boolean;
    firstTouch?: boolean;
}

export enum State {
    White = 'W',
    Empty = '',
    Black = 'B',
}

export default class Intersection extends React.Component<IntersectionProps, IntersectionStates> {

    constructor(props: IntersectionProps, ctx: any) {
        super(props, ctx);
        this.state = { hover: false };
    }

    private onMouseEnter(e: React.MouseEvent<HTMLDivElement>) {
        this.props.onMouseEnter ? this.props.onMouseEnter(this.props.row, this.props.col) : undefined;
        if (this.props.disabled) return;
        this.setState({ hover: true });
    }

    private onMouseLeave(e: React.MouseEvent<HTMLDivElement>) {
        this.setState({ hover: false });
        this.props.onMouseLeave ? this.props.onMouseLeave(this.props.row, this.props.col) : undefined;
    }

    private onClick(e: React.MouseEvent<HTMLDivElement>) {
        if (this.props.disabled) return;

        if (this.props.onTouch) {
            this.props.onTouch(this.props.row, this.props.col);
        }

        if (!this.props.needTouchConfirmation) {
            this.props.onClick(this.props.row, this.props.col);
            return;
        }

        if (this.state.touchConfirmed) {
            this.props.onClick(this.props.row, this.props.col);
            this.setState({ touchConfirmed: false, firstTouch: false });
            return;
        }

        this.setState({ touchConfirmed: true, firstTouch: true });
    }

    private onTouchStart() {
        if (this.props.winrate && this.props.onVariationHover)
            this.props.onVariationHover(this.props.row, this.props.col)
    }

    private onTouchLeave() {
        if (this.props.winrate && this.props.onVariationHoverLeave)
            this.props.onVariationHoverLeave(this.props.row, this.props.col)
    }

    componentDidUpdate() {
        if (!this.state.firstTouch) return;
        if (!this.props.showTouchConfirmation) {
            this.setState({ firstTouch: false, touchConfirmed: false });
        }
    }
    render() {
        const gridColor = this.props.style ? (this.props.style.color || 'black') : 'black';
        const highlightSize = this.props.highlightPointSize === 'small' ? 5 : 8;
        // const moveNumberPaddingTop = this.props.highlightPointSize === 'small' ? 0 : 2;
        const moveNumberFontSize = this.props.fontSize && this.props.highlightPointSize === 'large' ? this.props.fontSize + 2 : (this.props.fontSize || 10);
        const winrateMargin = this.props.highlightPointSize === 'small' ? '3%' : '4.3%';
        const winrate = (this.props.winrate || {}) as WinRate;

        return (

            <div style={{ float: 'left', lineHeight: 1, paddingTop: `${this.props.width}%`, width: `${this.props.width}%`, position: 'relative', textAlign: 'center' }}>

                {/* Vertical Grid Line */}
                <div style={{ pointerEvents: 'none', background: gridColor, height: this.props.lineThickness || 1, position: 'absolute', top: '50%', right: this.props.rightEdge ? '50%' : 0, left: this.props.leftEdge ? '50%' : 0, transform: 'translateY(-50%)' }} />

                {/* Horizontal Grid Line */}
                <div style={{ pointerEvents: 'none', background: gridColor, width: this.props.lineThickness || 1, position: 'absolute', left: '50%', top: this.props.topEdge ? '50%' : 0, bottom: this.props.bottomEdge ? '50%' : 0, transform: 'translateX(-50%)' }} />

                {/* Star Point */}
                {this.props.star ? <div style={{ pointerEvents: 'none', background: this.props.style ? (this.props.style.startPointColor || '#d3d3d380') : '#d3d3d380', borderRadius: '50%', height: 6, width: 6, position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', }} /> : null}

                {/* Touch Surface */}
                <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, background: 'rgba(0, 0, 0, 0)', border: this.state.hover && this.props.state === State.Empty && !this.state.firstTouch ? '2px dashed rgba(0, 0, 0, 0.15)' : undefined, }} onMouseEnter={e => this.onMouseEnter(e)} onMouseLeave={e => this.onMouseLeave(e)} onClick={e => this.onClick(e)} />

                {/* Heatmap */}
                <div className={BrowserHelper.isSafari ? 'heatmap-safari' : 'heatmap'} style={{ transform: `scale(1.${this.props.heatmap || 0})`, opacity: this.props.heatmap && this.props.heatmap > 0 && !this.props.winrate ? 0.5 + (this.props.heatmap || 0) / 20 : 0, width: '100%', height: '100%', position: 'absolute', zIndex: 1, top: 0, left: 0, pointerEvents: 'none', transition: 'all 0.5s', }} />

                {/* Winrate */}
                <div className='uk-tooltip-visits' uk-tooltip={this.props.winrate ? `${this.props.winrate.visits} Visits` : undefined}
                    style={{ width: '100%', height: '100%', position: 'absolute', left: 0, top: 0, fontSize: this.props.fontSize || 10, background: 'transparent', opacity: this.props.state !== State.Empty ? 0 : (winrate.value || winrate.uvalue) ? (winrate.weight || 1) + 0.45 : 0, transition: 'all 0.5s', zIndex: 2 }}
                    onMouseEnter={e => this.onMouseEnter(e)}
                    onClick={e => this.onClick(e)}
                    onTouchStart={e => this.onTouchStart()}
                    onTouchCancel={e => this.onTouchLeave()}
                    onTouchEnd={e => this.onTouchLeave()}
                    onMouseLeave={e => { this.onMouseLeave(e); this.props.winrate && this.props.onVariationHoverLeave ? this.props.onVariationHoverLeave(this.props.row, this.props.col) : undefined }}
                    onMouseOver={e => this.props.winrate && this.props.onVariationHover ? this.props.onVariationHover(this.props.row, this.props.col) : undefined}>

                    <div className={this.props.winrate && this.props.winrate.value ? (this.props.winrate.highest ? 'winrate-high' : 'winrate') : 'winrate-grey'} style={{ backgroundColor: this.props.style && this.props.style.winrateBackground, marginLeft: winrateMargin, marginTop: winrateMargin, borderRadius: '51%', width: '85%', height: '85%', display: 'flex', justifyContent: 'center', alignContent: 'center', alignItems: 'center', userSelect: 'none', color: this.props.style ? this.props.style.winrateFontColor : undefined }}>
                        {winrate.value || winrate.uvalue}
                    </div>
                </div>

                <div className='center-div' style={{ transition: this.props.disableAnimation ? undefined : `opacity ${this.props.moveNumber ? 0.5 : 0}s`, opacity: this.props.state !== State.Empty ? 1 : 0, transitionDelay: this.props.disableAnimation ? undefined : `${(this.props.moveNumber || 0) / 5}s`, }}>
                    {
                        this.props.state === State.Black ?
                            <Stone style={{ color: this.props.style ? (this.props.style.blackStoneColor || 'black') : 'black', zIndex: 2 }} highlight={this.props.highlight && !this.props.moveNumber} highlightSize={highlightSize} /> :
                            this.props.state === State.White ?
                                <Stone style={{ color: this.props.style ? (this.props.style.whiteStoneColor || 'white') : 'white', zIndex: 2 }} highlight={this.props.highlight && !this.props.moveNumber} highlightSize={highlightSize} /> : undefined
                    }
                </div>

                {/* Move Number */}
                <div style={{
                    opacity: this.props.state !== State.Empty ? 1 : 0,
                    transition: this.props.disableAnimation ? undefined : 'opacity 0.8s',
                    transitionDelay: this.props.disableAnimation ? undefined : `${(this.props.moveNumber || 0) / 5}s`,
                    position: 'absolute',
                    top: '0%', left: '0%', right: '0%', bottom: '0%',
                    display: 'flex', justifyContent: 'center', alignItems: 'center', alignContent: 'center',
                    verticalAlign: 'middle', textAlign: 'center',
                    fontSize: moveNumberFontSize, pointerEvents: 'none',
                    color: this.props.state === State.Black ? 'white' : 'black',
                    zIndex: 2, fontWeight: 600,
                }}>
                    <span style={{ display: 'flex', alignContent: 'end', paddingTop: BrowserHelper.iPhone || (BrowserHelper.isFirefox && BrowserHelper.isMobile) ? 0 : (BrowserHelper.isSafari ? 1 : (BrowserHelper.isChrome && !BrowserHelper.isMobile ? 1.5 : 2)) }}>{this.props.moveNumber}</span>
                </div>

                {
                    this.props.showTouchConfirmation && this.state.firstTouch && this.props.needTouchConfirmation && this.props.state === State.Empty ?
                        <div style={{ borderRadius: '50%', border: '2px solid #c5f442', pointerEvents: 'none', position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, margin: '2%', zIndex: 1 }} /> :
                        undefined
                }

            </div >
        );
    }
}