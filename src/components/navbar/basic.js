import React from "react";
import styled, { css } from "styled-components";
const overrideCss = css => {
  if (!css) return "";
  return Object.keys(css).reduce(
    (prev, key) => `
    ${prev}
    ${key} { 
      ${css[key]}
    }
  `,
    ""
  );
};
const bg = styled.div`
  background: red;
`;
window.bg = bg;
export const Navbar = styled("nav")`
  left: 0px;
  right: 0px;
  display: flex;
  align-items: center;
  justify-content: space-between; // space out brand from logo
  padding: 20px;
  min-height: 60px;
  ${props => overrideCss(props.css)}
`;
Navbar.section = styled("div")`
  flex: 1 1 50%;
  text-align: ${({ right }) => (!right ? "left" : "right")};
`;
Navbar.Panel = styled("nav")`
  display: flex;
  justify-content: flex-end;
`;
Navbar.Link = styled("a")`
  display: block;
  padding: 0.5rem 0.8rem;
  color: #e8e8e8;
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
const Component = ({ menuItems, className, css }) => (
  <Navbar className={className} css={css}>
    <Navbar.section>
      <a class="navbar-brand" href="#">
        <img
          class="logo-dark"
          src="http://thetheme.io/thesaas/assets/img/logo-light.png"
          alt="logo"
        />
      </a>
    </Navbar.section>
    <Navbar.section right>
      <section class="navbar-mobile">
        <Navbar.Panel>
          {menuItems.map(item => (
            <Navbar.Link class="nav-link">{item.text}</Navbar.Link>
          ))}
        </Navbar.Panel>
      </section>
    </Navbar.section>
  </Navbar>
);
Component.defaultProps = {
  menuItems: [{ text: "Home" }]
};
export default Component;
