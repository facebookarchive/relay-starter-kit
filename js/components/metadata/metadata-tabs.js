import React from 'react';
import Tab from 'react-bootstrap/lib/Tab';
import Tabs from 'react-bootstrap/lib/Tabs';
import TablePreview from './table-preview'

export default class MetadataTabs extends React.Component{
  render() {
    return <Tabs defaultActiveKey={2} id="metadata-tab">
      <Tab eventKey={1} title="Tab 1"><TablePreview/></Tab>
      <Tab eventKey={2} title="Tab 2">Tab 2 content</Tab>
      <Tab eventKey={3} title="Tab 3" disabled>Tab 3 content</Tab>
    </Tabs>
  }
}


