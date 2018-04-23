import * as React from 'react';
import { CSSProperties } from 'react';
import Stone from './Stone';

const GridLineColor = '#63380E';
const BoardColor = '#e5ba67';
const WhiteStoneColor = '#EEEEF0';
const BlackStoneColor = '#101015';

interface IntersectionProps {
    width: number;
    onClick: (row: number, col: number) => void;
    onMouseEnter?: (row: number, col: number) => void;
    onMouseLeave?: (row: number, col: number) => void;
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
    style?: CSSProperties & { whiteStoneColor?: string, blackStoneColor?: string };
}

interface IntersectionStates {
    hover: boolean;
}

export enum State {
    Empty,
    Black,
    White,
}

export class Intersection extends React.Component<IntersectionProps, IntersectionStates> {

    constructor(props: IntersectionProps, ctx: any) {
        super(props, ctx);
        this.state = { hover: false };
    }

    private onMouseEnter(e: React.MouseEvent<HTMLDivElement>) {
        if (this.props.disabled) return;
        if (this.props.onMouseEnter) this.props.onMouseEnter(this.props.row, this.props.col);
        this.setState({ hover: true });
    }

    private onMouseLeave(e: React.MouseEvent<HTMLDivElement>) {
        this.setState({ hover: false });
    }

    private onClick(e: React.MouseEvent<HTMLDivElement>) {
        if (this.props.disabled) return;
        this.props.onClick(this.props.row, this.props.col);
    }

    render() {
        const gridColor = this.props.style ? (this.props.style.color || GridLineColor) : GridLineColor;

        return (

            <div style={{ float: 'left', lineHeight: 1, paddingTop: `${this.props.width}%`, width: `${this.props.width}%`, position: 'relative', textAlign: 'center' }}>

                {/* Star Point */}
                {this.props.star ? <div style={{ pointerEvents: 'none', background: gridColor, borderRadius: 9000, height: 6, width: 6, position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }} /> : null}

                {/* Vertical Grid Line */}
                <div style={{ pointerEvents: 'none', background: gridColor, height: 1, position: 'absolute', top: '50%', right: this.props.rightEdge ? '50%' : 0, left: this.props.leftEdge ? '50%' : 0, transform: 'translateY(-50%)' }} />

                {/* Horizontal Grid Line */}
                <div style={{ pointerEvents: 'none', background: gridColor, width: 1, position: 'absolute', left: '50%', top: this.props.topEdge ? '50%' : 0, bottom: this.props.bottomEdge ? '50%' : 0, transform: 'translateX(-50%)' }} />

                {/* Touch Surface */}
                <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, background: this.state.hover && this.props.state === State.Empty ? 'rgba(255, 255, 255, 0.5)' : undefined, }} onMouseEnter={e => this.onMouseEnter(e)} onMouseLeave={e => this.onMouseLeave(e)} onClick={e => this.onClick(e)} />

                {/* {
                    this.props.state === State.Black ?
                        <Stone style={{ color: this.props.style ? (this.props.style.blackStoneColor || BlackStoneColor) : BlackStoneColor }} /> :
                        this.props.state === State.White ?
                            <Stone style={{ color: this.props.style ? (this.props.style.whiteStoneColor || WhiteStoneColor) : WhiteStoneColor }} /> : undefined
                } */}
            </div>
        );
    }
}