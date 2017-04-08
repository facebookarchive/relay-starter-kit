import React from 'react'
import Nav from 'react-bootstrap/lib/Nav'
import Navbar from 'react-bootstrap/lib/Navbar'
import NavItem from 'react-bootstrap/lib/NavItem'
import FormGroup from 'react-bootstrap/lib/FormGroup'
import FormControl from 'react-bootstrap/lib/FormControl'
import Button from 'react-bootstrap/lib/Button'

export default class TopBar extends React.Component {
  render() {
    return <Navbar>
      <Navbar.Header>
        <Navbar.Brand>
          <a href="#">FooPlatform</a>
        </Navbar.Brand>
        <Navbar.Toggle />
      </Navbar.Header>
      <Navbar.Collapse>
        <Nav pullRight>
          <NavItem eventKey={1} href="#">Sign-in</NavItem>
          <NavItem eventKey={2} href="#">Login</NavItem>
        </Nav>
        <Navbar.Form pullRight>
          <FormGroup>
            <FormControl type="text" placeholder="Search" />
          </FormGroup>
          {' '}
          <Button type="submit">Submit</Button>
        </Navbar.Form>
      </Navbar.Collapse>
    </Navbar>
  }
}

// const navbarInstance = (
//   <Navbar>
//     <Navbar.Header>
//       <Navbar.Brand>
//         <a href="#">Brand</a>
//       </Navbar.Brand>
//       <Navbar.Toggle />
//     </Navbar.Header>
//     <Navbar.Collapse>
//       <Navbar.Form pullLeft>
//         <FormGroup>
//           <FormControl type="text" placeholder="Search" />
//         </FormGroup>
//         {' '}
//         <Button type="submit">Search</Button>
//       </Navbar.Form>
//     </Navbar.Collapse>
//   </Navbar>
// );