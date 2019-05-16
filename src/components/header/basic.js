import React from "react";
import styled from "styled-components";
const Navbar = styled("nav")`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between; // space out brand from logo
  padding: 20px;
  min-height: 60px;
`;
Navbar.section = styled("div")`
  flex: 1 1 50%;
  text-align: ${({ right }) => (!right ? "left" : "right")};
`;
const NavLinkPanel = styled("nav")`
  display: flex;
  justify-content: flex-end;
`;
const NavLink = styled("a")`
  display: block;
  padding: 0.5rem 0.8rem;
  color: #757575;
  font-weight: 400;
  line-height: 56px;
  padding-top: 0;
  padding-bottom: 0;
  font-weight: 600;
  text-transform: uppercase;
  text-decoration: none;
  letter-spacing: 1px;
  font-size: 0.7em;
  word-spacing: 2px;
`;
export default () => (
  <Navbar>
    <Navbar.section>
      <a class="navbar-brand" href="#">
        <img
          class="logo-dark"
          src="http://thetheme.io/thesaas/assets/img/logo-dark.png"
          alt="logo"
        />
      </a>
    </Navbar.section>
    <Navbar.section right>
      <section class="navbar-mobile">
        <NavLinkPanel>
          <NavLink class="nav-link" href="#home">
            Home
          </NavLink>
          <NavLink class="nav-link" href="#section-features">
            Features
          </NavLink>
          <NavLink class="nav-link" href="#section-pricing">
            Pricing
          </NavLink>
          <NavLink class="nav-link" href="#section-faq">
            FAQ
          </NavLink>
          <NavLink class="nav-link" href="#footer">
            Contact
          </NavLink>
        </NavLinkPanel>
      </section>
    </Navbar.section>
  </Navbar>
);
