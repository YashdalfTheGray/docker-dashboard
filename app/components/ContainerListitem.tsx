import * as React from 'react';

export interface Container {
    id: string,
    name: string,
    image: string,
    state: string,
    status: string
}

export class ContainerlistItem extends React.Component<Container, {}> {
    render() {
        return (
            <div>
                Container List Item
            </div>
        );
    }
}
