/* eslint-disable no-unused-vars */
/* eslint-disable react/no-array-index-key */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Checkbox, Text } from 'versa-ui';
import styled from 'styled-components';
import { InfoCircle } from 'styled-icons/boxicons-regular';
// import { TriangleDown } from 'styled-icons/octicons/TriangleDown';
import { GET } from 'utils';
import messages from './messages';
import CardLoader from '../CardLoader';

const Table = styled.table`
  width: 100%;
`;

const StyledText = styled(Text)`
  font-size: 15px;
`;

const Row = styled.tr``;
const HeaderCell = styled.th`
  color: #fff;
`;

const StyledCell = styled.td`
  font-size: 15px;
  color: #fff;
  text-align: left;
`;

const DataTable = ({ noResultsMessage, children, resource }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const splitResource = resource.split('+');
    const endPoint = splitResource[0];
    const response = await GET(endPoint);
    const responseData = response.data;

    switch (splitResource.length) {
      case 1:
        setData(responseData);
        break;
      case 2:
        setData(responseData[`${splitResource[1]}`]);
        break;
      case 3:
        setData(responseData[`${splitResource[2]}`]);
        break;

      default:
    }
    setLoading(false);
  };

  const setCellBackground = child => {
    if (child.props.type === 'link') return 'transparent';
    return 'rgba(0, 0, 0, 0.09)';
  };

  const renderCell = (child, record) => {
    switch (child.props.type) {
      case 'bool':
        if (record[child.props.source].toString() === 'true') {
          return <Checkbox style={{ padding: '0px' }} readOnly checked />;
        }
        return <Checkbox style={{ padding: '0px' }} />;
      case 'link':
        return (
          <a
            href={record[child.props.source]}
            style={{
              textDecoration: 'none',
              color: '#fff',
            }}
          >
            <InfoCircle size="20" color="#007eff" />
          </a>
        );
      default:
        return record[child.props.source] || '';
    }
  };
  if (loading) {
    return (
      <CardLoader
        style={{ display: 'flex', justifyContent: 'center', padding: '52px' }}
        loadingMessage={messages.header}
      />
    );
  }
  if (data.length === 0) {
    return (
      <span
        style={{
          display: 'flex',
          justifyContent: 'center',
          padding: '52px',
          paddingLeft: '64px',
        }}
      >
        {noResultsMessage}
      </span>
    );
  }
  return (
    <div>
      <Table>
        <tbody>
          <tr>
            {React.Children.map(children, (child, i) => (
              <HeaderCell key={i}>
                <div
                  style={{
                    display: 'flex',
                    padding: '2px 3px',
                    borderBottom: '1px solid #e0e0e0',
                  }}
                >
                  <StyledText
                    style={{
                      margin: '0px',
                    }}
                  >
                    {child.props.label || child.props.source}
                  </StyledText>
                </div>
              </HeaderCell>
            ))}
          </tr>
        </tbody>
        <tbody>
          {data.slice(0, 4).map((record, i) => (
            <Row key={i}>
              {React.Children.map(children, (child, j) => (
                <StyledCell key={j}>
                  <div
                    style={{
                      padding: '2px 3px',
                      margin: '1px',
                      backgroundColor: setCellBackground(child),
                    }}
                  >
                    {renderCell(child, record) || child.props.suffix || '-'}
                  </div>
                </StyledCell>
              ))}
            </Row>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

DataTable.propTypes = {
  children: PropTypes.any,
  resource: PropTypes.any,
  noResultsMessage: PropTypes.any,
};

export default DataTable;
