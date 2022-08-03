import { useForm } from "react-hook-form";
import { Draggable, Droppable } from "react-beautiful-dnd";
import styled from "styled-components";
import { ITodo, toDoState } from "../atoms";
import { useSetRecoilState } from "recoil";
import DragabbleCard from "./DragabbleCard";

const Wrapper = styled.div`
  width: 300px;
  padding-top: 10px;
  background-color: ${(props) => props.theme.boardColor};
  border-radius: 5px;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const TitleWrapper = styled.div`
  text-align: center;
  margin-bottom: 10px;
`;

const Title = styled.h2`
  display: inline-block;
  width: 250px;
  text-align: center;
  font-weight: 600;
  font-size: 18px;
`;

const Delete = styled.button`
  width: 30px;
  height: 30px;
  background-color: inherit;
  border: none;
`;

interface IAreaProps {
  isDraggingFromThis: boolean;
  isDraggingOver: boolean;
}

const Area = styled.div<IAreaProps>`
  background-color: ${(props) =>
    props.isDraggingOver
      ? "#dfe6e9"
      : props.isDraggingFromThis
      ? "#b2bec3"
      : "transparent"};
  flex-grow: 1;
  transition: background-color 0.3s ease-in-out;
  padding: 20px;
`;

const Form = styled.form`
  width: 100%;
  input {
    width: 90%;
  }
`;

const Input = styled.input`
  display: flex;
  padding: 5px;
  border-radius: 5px;
  margin: auto;
`;

interface IBoardProps {
  toDos: ITodo[];
  boardId: string;
  boardNum: number;
}

interface IForm {
  toDo: string;
}

function Board({ toDos, boardId, boardNum }: IBoardProps) {
  const setToDos = useSetRecoilState(toDoState);
  const onDelhandler = (boardId: string) => {
    setToDos((allBoards) => {
      const copiedAllBoard = { ...allBoards };
      delete copiedAllBoard[boardId];
      return copiedAllBoard;
    });
  };
  const { register, setValue, handleSubmit } = useForm<IForm>();
  const onValid = ({ toDo }: IForm) => {
    const newToDo = {
      id: Date.now(),
      text: toDo,
    };
    setToDos((allBoards) => {
      return {
        ...allBoards,
        [boardId]: [newToDo, ...allBoards[boardId]],
      };
    });
    setValue("toDo", "");
  };
  return (
    <Draggable draggableId={boardId} index={boardNum}>
      {(magic) => (
        <Wrapper
          ref={magic.innerRef}
          {...magic.dragHandleProps}
          {...magic.draggableProps}
        >
          <TitleWrapper>
            <Title>{boardId}</Title>
            <Delete onClick={() => onDelhandler(boardId)}>❌</Delete>
          </TitleWrapper>

          <Form onSubmit={handleSubmit(onValid)}>
            <Input
              {...register("toDo", { required: true })}
              type="text"
              placeholder={`Add task on ${boardId}`}
            />
          </Form>
          <Droppable droppableId={boardId}>
            {(magic, info) => (
              <Area
                isDraggingOver={info.isDraggingOver}
                isDraggingFromThis={Boolean(info.draggingFromThisWith)}
                ref={magic.innerRef}
                {...magic.droppableProps}
              >
                {toDos.map((toDo, index) => (
                  <DragabbleCard
                    key={toDo.id}
                    index={index}
                    toDoId={toDo.id}
                    toDoText={toDo.text}
                  />
                ))}
                {magic.placeholder}
              </Area>
            )}
          </Droppable>
        </Wrapper>
      )}
    </Draggable>
  );
}
export default Board;
