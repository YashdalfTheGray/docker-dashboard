import * as React from 'react';

import ContainerListItem, { Container } from './ContainerListitem';

export class ContainerListProps {
    containers: Container[];
    title?: string;
}

export default class ContainerList extends React.Component<ContainerListProps, {}> {
    render() {
        return (
            <div>
                <h3>{this.props.title}</h3>
                <p>{ this.props.containers.length === 0 ? 'No containers to show' : '' }</p>
                <div className="row">{this.props.containers.map(c => <ContainerListItem key={c.name} {...c} />)}</div>
            </div>
        );
    }
}
