import * as React from 'react';
import { CSSProperties } from 'react';

interface EngineProps {
    engine?: string;
    onChange?: (e: any) => void;
}

export default class Engine extends React.Component<EngineProps, any> {

    render() {
        return (
          <select style={{ width: '100%' }} onChange={this.props.onChange} defaultValue={this.props.engine}>
            <option value="KataGo">{'KataGo'}</option>
            <option value="KataGo:s29096448-d8520277">{'KataGo:s29096448-d8520277'}</option>
          </select>
        );
    }
}
