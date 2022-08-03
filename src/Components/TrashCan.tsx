import { Droppable } from "react-beautiful-dnd";
import styled from "styled-components";

interface IAreaProps {
  isDraggingOver: boolean;
}

const Area = styled.div<IAreaProps>`
  width: 100px;
  padding-top: 10px;
  background-color: ${(props) =>
    props.isDraggingOver ? "#ff5e57" : "#dfe6e9"};
  border-radius: 5px;
  min-height: 50px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  justify-content: center;
  align-items: center;
  font-size: 100px;
`;

function TrashCan() {
  return (
    <Droppable droppableId="trash">
      {(magic, info) => (
        <Area
          isDraggingOver={info.isDraggingOver}
          ref={magic.innerRef}
          {...magic.droppableProps}
        >
          🗑
        </Area>
      )}
    </Droppable>
  );
}

export default TrashCan;
