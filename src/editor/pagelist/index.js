import React from "react";
import pages from "../../data/pages";
import styled from "styled-components";
import EditPost from "./edit";
import { Route } from "react-router-dom";
export { EditPost };
const Muted = styled.div`
  color: #888;
  font-size: 11px;
`;
const PageTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0px;
  thead th {
    border-bottom: 1px solid #eee;
    padding: 0.5rem;
  }
  th {
    font-size: 9px;
    text-transform: uppercase;
    color: #888;
    text-align: left;
  }
  td {
    border-bottom: 1px solid #eee;
    padding: 0.5rem 0.5rem;
    vertical-align: middle;
    color: #444;
    font-size: 13px;
  }
`;
const Title = styled.div`
  font-size: 13px;
  font-weight: bold;
`;
const TableContainer = styled.div`
  padding: 2rem;
`;
const H1 = styled.h1`
  margin-bottom: 1rem;
  font-size: 1.2rem;
  color: #222;
`;
const ListPages = () => {
  return (
    <TableContainer>
      <H1>
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M18 0H2C0.9 0 0.00999999 0.9 0.00999999 2L0 20L4 16H18C19.1 16 20 15.1 20 14V2C20 0.9 19.1 0 18 0ZM16 12H4V10H16V12ZM16 9H4V7H16V9ZM16 6H4V4H16V6Z"
            fill="currentColor"
          />
        </svg>{" "}
        Pages
      </H1>
      <PageTable>
        <thead>
          <tr>
            <th>Page</th>
            <th>Last Updated</th>
            <th>State</th>
          </tr>
        </thead>
        {pages.map(page => (
          <tr>
            <td>
              <Title>{page.title}</Title>
              <Muted>{page.name}</Muted>
            </td>

            <td>12th May 2019, 12:31pm</td>

            <td>Published</td>
          </tr>
        ))}
      </PageTable>
    </TableContainer>
  );
};

export default () => (
  <>
    <Route path="/pages" exact component={ListPages} />
    <Route path="/pages/edit" exact component={EditPost} />
  </>
);
