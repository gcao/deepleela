import * as React from 'react';
import Intersection, { State } from './Intersection';
import { CSSProperties } from 'react';

interface BoardProps {
    size: number;
    className?: string;
    id?: string;
    disabled?: boolean;
    showCoordinate?: boolean;
    hightlightCoord?: { x: number, y: number };

    /**
     * Calls when users click a position on board, cartesian coordinate
     */
    onIntersectionClicked?: (row: number, col: number) => void;

    style?: CSSProperties & { boardColor?: string, gridColor?: string, whiteStoneColor?: string, blackStoneColor?: string };
    states: State[][];
    heatmap?: number[][];
}

interface BoardStates {
}

export default class Board extends React.Component<BoardProps, BoardStates> {

    static readonly alphabets = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T'];

    static cartesianCoordToArrayPosition(x: number, y: number, size = 19) {
        return { x: size - x, y: y - 1 };
    }

    static cartesianCoordToString(x: number, y: number) {
        return `${Board.alphabets[y - 1]}${x}`;
    }

    static stringToCartesianCoord(coord: string) {
        let alphabet = coord[0];
        let y = Board.alphabets.indexOf(alphabet) + 1;
        let x = Number.parseInt(coord.substr(1));
        return { x, y };
    }

    private onClick(row: number, col: number) {
        if (!this.props.onIntersectionClicked) return;
        this.props.onIntersectionClicked(row, col);
    }

    render() {
        const size = 100.0 / this.props.size;
        const dimension = this.props.size;

        const boardParent = document.getElementById('board');
        let gridWidth = boardParent ? boardParent.getBoundingClientRect().height * (size / 100.0) : 0;
        let top = gridWidth / 2 - 6.25;


        let gridLineColor = this.props.style ? this.props.style.gridColor : undefined;

        return (
            <div className={this.props.className} id={this.props.id} style={this.props.style} draggable={false}>

                <div style={{ background: this.props.style ? (this.props.style.background || '') : '', padding: 4, paddingBottom: `${0.6 + size}%`, }}>

                    {this.props.states.map((row, i) => (
                        <div style={{ clear: 'both', height: `${size}%`, position: 'relative' }} key={i} >
                            {this.props.showCoordinate ? <div style={{ position: 'absolute', left: 0, top: top, bottom: 0, fontSize: 8, fontWeight: 100, color: '#cccccc80', }}>{19 - i}</div> : undefined}

                            {row.map((state, j) => (
                                <div key={`${i},${j}`}>
                                    {this.props.showCoordinate && i === (this.props.size - 1) ?
                                        <div style={{ position: 'absolute', bottom: 0, left: top + 2 + j * (gridWidth - 2.52), fontSize: 8, fontWeight: 100, color: '#cccccc80', top: top + 12 }}>
                                            {'ABCDEFGHJKLMNOPQRST'[j]}
                                        </div>
                                        : undefined
                                    }

                                    <Intersection
                                        onClick={(r, c) => this.onClick(r, c)}
                                        style={{ color: gridLineColor, whiteStoneColor: this.props.style ? this.props.style.whiteStoneColor : 'white', blackStoneColor: this.props.style ? this.props.style.blackStoneColor : 'black' }}
                                        key={j}
                                        row={19 - i}
                                        col={j + 1}
                                        lineThickness={2}
                                        disabled={this.props.disabled}
                                        highlight={this.props.hightlightCoord && i === (this.props.size - this.props.hightlightCoord.x) && j === this.props.hightlightCoord.y - 1}
                                        width={size}
                                        state={state}
                                        topEdge={i === 0}
                                        bottomEdge={i === dimension - 1}
                                        leftEdge={j === 0}
                                        rightEdge={j === dimension - 1}
                                        star={[3, dimension - 4, (dimension - 1) / 2].indexOf(i) >= 0 && [3, dimension - 4, (dimension - 1) / 2].indexOf(j) >= 0}
                                        highlightSize={gridWidth > 25 ? 'large' : 'small'}
                                        heatmap={this.props.heatmap ? this.props.heatmap[i][j] : 0}
                                    />
                                </div>
                            ))}

                        </div>
                    ))}

                </div>

            </div>
        );
    }
}