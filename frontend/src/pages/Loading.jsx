import { Spin } from "antd";
import { styled } from "styled-components";

const LoadingContainer = styled.div`
  width: 100%;
  height: calc((100vh - 64px));
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Loading = () => {
  return (
    <LoadingContainer>
      <Spin size="large" />;
    </LoadingContainer>
  );
};

export default Loading;
