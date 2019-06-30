import React from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
const Sidebar = styled.div`
  background: #212936;
  color: #56657f;
  ${({ collapse }) =>
    collapse
      ? `
    max-width: 52px;
    overflow-x:hidden;
    `
      : `max-width: 256px;`}
  width:100%;
`;

const SidebarLinkContainer = styled(NavLink)`
  display: flex;
  margin: 4px 8px;
  padding: 0px 8px;
  min-height: 40px;
  align-items: center;
  text-decoration: none;
  &:hover {
    color: ${props => (props.active ? "#ffffff" : "#a2afc7")};
  }
  color: inherit;
  &.active {
    background: #2b3648;
    color: #ffffff;
  }
`;
const SidebarLinkText = styled.div`
  flex: 1 1 100%;
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 21px;
`;
const SidebarLinkIcon = styled.div`
  flex: 0 0 24px;
  margin-right: 32px;
  display: flex;
  align-items: center;
`;
const SidebarLink = ({ to, exact, text, active, icon, className }) => (
  <SidebarLinkContainer exact={exact} to={to} active={active}>
    <SidebarLinkIcon>{icon}</SidebarLinkIcon>
    <SidebarLinkText>{text}</SidebarLinkText>
  </SidebarLinkContainer>
);
export default ({ collapse }) => (
  <Sidebar collapse={collapse}>
    <SidebarLink
      to="/"
      exact
      text="Dashboard"
      icon={
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 10H8V0H0V10ZM0 18H8V12H0V18ZM10 18H18V8H10V18ZM10 0V6H18V0H10Z"
            fill="currentColor"
          />
        </svg>
      }
    />
    <SidebarLink
      text="Pages"
      to="/pages"
      active
      icon={
        <svg width="20" height="20" viewBox="0 0 32 32">
          <path
            fill="currentColor"
            d="M28.681 11.159c-0.694-0.947-1.662-2.053-2.724-3.116s-2.169-2.030-3.116-2.724c-1.612-1.182-2.393-1.319-2.841-1.319h-11.5c-1.379 0-2.5 1.122-2.5 2.5v23c0 1.378 1.121 2.5 2.5 2.5h19c1.378 0 2.5-1.122 2.5-2.5v-15.5c0-0.448-0.137-1.23-1.319-2.841zM24.543 9.457c0.959 0.959 1.712 1.825 2.268 2.543h-4.811v-4.811c0.718 0.556 1.584 1.309 2.543 2.268v0zM28 29.5c0 0.271-0.229 0.5-0.5 0.5h-19c-0.271 0-0.5-0.229-0.5-0.5v-23c0-0.271 0.229-0.5 0.5-0.5 0 0 11.499-0 11.5 0v7c0 0.552 0.448 1 1 1h7v15.5z"
          />
          <path
            fill="currentColor"
            d="M18.841 1.319c-1.612-1.182-2.393-1.319-2.841-1.319h-11.5c-1.378 0-2.5 1.121-2.5 2.5v23c0 1.207 0.86 2.217 2 2.45v-25.45c0-0.271 0.229-0.5 0.5-0.5h15.215c-0.301-0.248-0.595-0.477-0.873-0.681z"
          />
        </svg>
      }
    />
    <SidebarLink
      text="Posts"
      to="/posts"
      icon={
        <svg width="20" height="20" viewBox="0 0 32 32">
          <path
            fill="currentColor"
            d="M27 0h-24c-1.65 0-3 1.35-3 3v26c0 1.65 1.35 3 3 3h24c1.65 0 3-1.35 3-3v-26c0-1.65-1.35-3-3-3zM26 28h-22v-24h22v24zM8 14h14v2h-14zM8 18h14v2h-14zM8 22h14v2h-14zM8 10h14v2h-14z"
          />
        </svg>
      }
    />
    <SidebarLink
      text="Forms"
      to="/forms"
      icon={
        <svg width="20" height="20" viewBox="0 0 32 32">
          <path
            fill="currentColor"
            d="M12 6h4v2h-4zM18 6h4v2h-4zM28 6v8h-6v-2h4v-4h-2v-2zM10 12h4v2h-4zM16 12h4v2h-4zM6 8v4h2v2h-4v-8h6v2zM12 18h4v2h-4zM18 18h4v2h-4zM28 18v8h-6v-2h4v-4h-2v-2zM10 24h4v2h-4zM16 24h4v2h-4zM6 20v4h2v2h-4v-8h6v2zM30 2h-28v28h28v-28zM32 0v0 32h-32v-32h32z"
          />
        </svg>
      }
    />
  </Sidebar>
);
