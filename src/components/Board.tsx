import * as React from 'react';
import Intersection, { State, WinRate } from './Intersection';
import { CSSProperties } from 'react';
import BrowserHelper from './BrowserHelper';

export interface Variation {
    visits: number;
    stats: { W: number, U: number, };
    variation: string[];
    weight: number;
}

interface BranchState {
    state: State;
    moveNumber: number;
}

interface BoardProps {
    size: number;
    id: string;
    disabled?: boolean;
    showCoordinate?: boolean;
    highlightCoord?: { x: number, y: number };
    needTouchConfirmation?: boolean;

    /**
     * Calls when users click a position on board, cartesian coordinate
     */
    onIntersectionClicked?: (row: number, col: number) => void;
    onIntersectionHover?: (x: number, y: number) => void;
    onIntersectionLeave?: (x: number, y: number) => void;

    style?: CSSProperties & { boardColor?: string, gridColor?: string, whiteStoneColor?: string, blackStoneColor?: string, coordTextColor?: string, starPointColor?: string, winrateColor?: string, winrateBackgroundColor?: string };
    states: State[][];
    heatmap?: number[][];
    fontSize?: number;
    currentColor: 'W' | 'B';

    // vb: virtual board
    vbSize: number;
    vbOffsetX: number;
    vbOffsetY: number;
}

interface BoardStates {
    variationStates: (Variation | undefined)[][];
    branchStates: (BranchState | undefined)[][];
    highlightWinrateVariationOffset?: { x: number, y: number };
    touchedCoord?: { x: number, y: number };
    disableAnimation?: boolean;
}

export default class Board extends React.Component<BoardProps, BoardStates> {

    static readonly alphabets = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T'];

    static cartesianCoordToArrayPosition(x: number, y: number, size: number) {
        return { x: size - x, y: y - 1 };
    }

    static cartesianCoordToString(x: number, y: number) {
        return `${Board.alphabets[y - 1]}${x}`;
    }

    static stringToCartesianCoord(coord: string) {
        let alphabet = coord[0];
        let y = Board.alphabets.indexOf(alphabet.toUpperCase()) + 1;
        let x = Number.parseInt(coord.substr(1));
        return { x, y };
    }

    static stringToArrayPosition(coord: string, size: number) {
        let cartesian = Board.stringToCartesianCoord(coord);
        return Board.cartesianCoordToArrayPosition(cartesian.x, cartesian.y, size);
    }

    static arrayPositionToCartesianCoord(x: number, y: number, size: number) {
        return { x: size - x, y: y + 1 };
    }

    constructor(props: BoardProps, ctx?: any) {
        super(props, ctx);

        let variationStates: (Variation | undefined)[][] = [];

        for (let i = 0; i < props.size; i++) {
            variationStates.push([]);
            for (let j = 0; j < props.size; j++) {
                variationStates[i].push(undefined);
            }
        }

        let branchStates: (BranchState | undefined)[][] = [];
        for (let i = 0; i < props.size; i++) {
            branchStates.push([]);
            for (let j = 0; j < props.size; j++) {
                branchStates[i].push(undefined)
            }
        }

        this.state = { variationStates, branchStates };
    }

    private onClick(row: number, col: number) {
        if (!this.props.onIntersectionClicked) return;
        this.props.onIntersectionClicked(row, col);
    }

    private onVariationHover(row: number, col: number) {
        let { x, y } = Board.cartesianCoordToArrayPosition(row, col, this.props.size);
        let branch = this.state.variationStates[x][y];
        if (!branch) return;
        if (!branch.variation || branch.variation.length === 0) return;

        let currColor = this.props.currentColor;

        branch.variation.forEach((value, i) => {
            let { x, y } = Board.stringToArrayPosition(value, this.props.size);
            let state = currColor === 'B' ? State.Black : State.White;
            currColor = currColor === 'B' ? 'W' : 'B';
            this.state.branchStates[x][y] = { state, moveNumber: i + 1 };
        });

        this.forceUpdate();
    }

    setVariations(varitations: Variation[]) {
        this.clearVariations();

        varitations.forEach(v => {
            let position = Board.stringToCartesianCoord(v.variation[0]);
            let arrayOffset = Board.cartesianCoordToArrayPosition(position.x, position.y, this.props.size);
            this.state.variationStates[arrayOffset.x][arrayOffset.y] = v;
        });

        let highlight = varitations[0];
        if (!highlight) {
            this.forceUpdate();
            return;
        }

        let pos = Board.stringToCartesianCoord(varitations[0].variation[0]);
        let offset = Board.cartesianCoordToArrayPosition(pos.x, pos.y, this.props.size);
        this.setState({ highlightWinrateVariationOffset: offset });
    }

    setMovesNumber(moves: { coord: { x: number, y: number }, number: number }[], length: number) {
        moves.forEach((m, i) => {
            if (i > length) return;
            let offset = Board.cartesianCoordToArrayPosition(m.coord.x, m.coord.y, this.props.size);
            let state = this.props.states[offset.x][offset.y];
            this.state.branchStates[offset.x][offset.y] = { state: State.Empty, moveNumber: m.number };
        });
    }

    clearVariations() {
        if (!this.state.branchStates || this.state.branchStates.length === 0) return;

        for (let i = 0; i < this.props.size; i++) {
            for (let j = 0; j < this.props.size; j++) {
                this.state.variationStates[i][j] = undefined;
            }
        }
    }

    clearBranchStates() {
        for (let i = 0; i < this.props.size; i++) {
            for (let j = 0; j < this.props.size; j++) {
                this.state.branchStates[i][j] = undefined;
            }
        }
    }

    setAnimation(enable: boolean) {
        this.setState({ disableAnimation: !enable });
    }

    clearTouchedCoord() {
        this.setState({ touchedCoord: { x: -1, y: -1 } });
    }

    getVisibleBoardState() {
        const { size, vbSize, vbOffsetX, vbOffsetY } = this.props;
        const visibleSize = size + 2 * vbSize;
        let state: State[][] = [];

        for (let i = 0; i < visibleSize; i++) {
            let realI = (i - vbOffsetX + size) % size;
            state.push([]);
            for (let j = 0; j < visibleSize; j++) {
                let realJ = (j - vbOffsetY + size) % size;
                state[i].push(this.props.states[realI][realJ]);
            }
        }

        return state;
    }

    render() {
        const visibleBoardState = this.getVisibleBoardState();

        const size = 100.0 / visibleBoardState.length;
        const dimension = this.props.size;

        const boardParent = document.getElementById(this.props.id || '');
        const gridWidth = boardParent ? boardParent!.getBoundingClientRect().height * (size / 100.0) : 0;
        const top = gridWidth / 2 - 6.25;
        const left = gridWidth / 2 - 4;
        const gridLineColor = this.props.style ? this.props.style.gridColor : undefined;
        const coordTextColor = this.props.style ? this.props.style.coordTextColor : gridLineColor;

        const startPoints = [dimension > 9 ? 3 : (dimension > 7 ? 2 : 1), dimension > 9 ? dimension - 4 : (dimension > 7 ? dimension - 3 : dimension - 2), (dimension - 1) / 2];

        return (
            <div id={this.props.id} style={this.props.style} draggable={false}>

                <div style={{ background: this.props.style ? (this.props.style.background || '') : '', padding: 4, paddingBottom: `${0.6 + size}%`, }}>

                    {visibleBoardState.map((row, i) => {
                        const realI = (i - this.props.vbOffsetX + this.props.size) % this.props.size;
                        return <div style={{ clear: 'both', height: `${size}%`, position: 'relative' }} key={i} >
                            {this.props.showCoordinate ? <div style={{ position: 'absolute', left: 0, top: top, bottom: 0, fontSize: 8, fontWeight: 100, color: coordTextColor, }}>{this.props.size - realI}</div> : undefined}

                            {row.map((state, j) => {
                                const realJ = (j - this.props.vbOffsetY + this.props.size) % this.props.size;
                                return <div key={`${i},${j}`}>
                                    <Intersection
                                        onClick={(r, c) => this.onClick(r, c)}
                                        style={{ color: gridLineColor, whiteStoneColor: this.props.style ? this.props.style.whiteStoneColor : 'white', blackStoneColor: this.props.style ? this.props.style.blackStoneColor : 'black', startPointColor: this.props.style ? this.props.style.starPointColor : undefined, winrateFontColor: this.props.style && this.props.style.winrateColor, winrateBackground: this.props.style && this.props.style.winrateBackgroundColor }}
                                        key={j}
                                        row={visibleBoardState.length - i}
                                        col={j + 1}
                                        // Daoqi virtual board parameters
                                        vbSize={this.props.vbSize}
                                        vbOffsetX={this.props.vbOffsetX}
                                        vbOffsetY={this.props.vbOffsetY}
                                        lineThickness={1}
                                        disabled={this.props.disabled}
                                        width={size}
                                        state={state === State.Empty ? (this.state.branchStates[realI][realJ] ? this.state.branchStates[realI][realJ]!.state : state) : state}
                                        topEdge={i === 0}
                                        bottomEdge={i === visibleBoardState.length - 1}
                                        leftEdge={j === 0}
                                        rightEdge={j === visibleBoardState.length - 1}
                                        star={startPoints.indexOf(realI) >= 0 && startPoints.indexOf(realJ) >= 0}
                                        highlight={this.props.highlightCoord && i === (visibleBoardState.length - this.props.highlightCoord.x) && j === this.props.highlightCoord.y - 1}
                                        highlightPointSize={gridWidth > 25 ? 'large' : 'small'}
                                        needTouchConfirmation={this.props.needTouchConfirmation !== undefined ? this.props.needTouchConfirmation : gridWidth < 25}
                                        onTouch={(x, y) => this.setState({ touchedCoord: { x, y } })}
                                        showTouchConfirmation={this.state.touchedCoord && i === (this.props.size - this.state.touchedCoord.x) && j === (this.state.touchedCoord.y - 1)}
                                        heatmap={this.props.heatmap ? this.props.heatmap[realI][realJ] : 0}
                                        winrate={this.state.variationStates[realI][realJ] ? {
                                            value: this.state.variationStates[realI][realJ]!.stats.W,
                                            uvalue: this.state.variationStates[realI][realJ]!.stats.U,
                                            visits: this.state.variationStates[realI][realJ]!.visits,
                                            weight: this.state.variationStates[realI][realJ]!.weight,
                                            highest: this.state.highlightWinrateVariationOffset ? this.state.highlightWinrateVariationOffset.x === i && this.state.highlightWinrateVariationOffset.y === j : false,
                                        } : undefined}
                                        fontSize={this.props.fontSize}
                                        onVariationHover={(row, col) => this.onVariationHover(row, col)}
                                        onVariationHoverLeave={(row, col) => { this.clearBranchStates(), this.forceUpdate() }}
                                        moveNumber={this.state.branchStates[realI][realJ] ? this.state.branchStates[realI][realJ]!.moveNumber : undefined}
                                        disableAnimation={this.state.disableAnimation}
                                    />
                                </div>
                            })}

                        </div>
                    })}
                    <div key='hlabel' style={{ position: 'absolute', bottom: 25 }}>
                        {visibleBoardState.map((_row, i) => {
                            const realI = (i - this.props.vbOffsetX + this.props.size) % this.props.size;
                            // TODO: the calculation is not working for different board size
                            const width = (gridWidth * visibleBoardState.length - Math.round(gridWidth) * i) * 0.96 / (visibleBoardState.length - i);
                            return <div key={i} style={{ display: 'inline-block', float: 'left', width: width }}>
                                <div style={{ left: 0, top: -15, textAlign: 'center', fontSize: 8, fontWeight: 100, color: coordTextColor }}>
                                    {'ABCDEFGHJKLMNOPQRST'[realI]}
                                </div>
                            </div>
                        })}
                    </div>
                </div>

            </div>
        );
    }
}