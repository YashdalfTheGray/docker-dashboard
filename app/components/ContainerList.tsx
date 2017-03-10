import * as React from 'react';

import ContainerListItem, { Container } from './ContainerListitem';

export class ContainerListProps {
    containers: Container[];
    title?: string;
}

export default class ContainerList extends React.Component<ContainerListProps, {}> {
    render() {
        return (
            <div style={{ margin: '16px' }}>
                <h3 style={{ fontFamily: 'Roboto' }}>{this.props.title}</h3>
                <p>{ this.props.containers.length === 0 ? 'No containers to show' : '' }</p>
                <div style={{ margin: '8px' }}>
                    {this.props.containers.map(c => <ContainerListItem key={c.name} {...c} />)}
                </div>
            </div>
        );
    }
}
