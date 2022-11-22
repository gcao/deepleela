import * as React from 'react';
import { CSSProperties } from 'react';

interface RingoProps {
    style: CSSProperties;
    className?: string;
}

export default class Ringo extends React.Component<RingoProps, any> {

    render() {
        return (
            <div
                className={this.props.className}
                style={Object.assign({ width: '1200px', height: '900px', } as CSSProperties, this.props.style)}>
                <svg width="100%" height="100%">
                    <path fill="none" stroke="lightgray" strokeWidth="2"
                        d="M 600, 450 a 75,150 0 1,0 1,0 z" />
                </svg>
            </div>
        );
    }
}
