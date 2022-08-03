import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { toDoState } from "./atoms";
import Board from "./Components/Board";
import NewBoard from "./Components/NewBoard";
import TrashCan from "./Components/TrashCan";

const Wrapper = styled.div`
  display: flex;
  width: 100vw;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  height: 70vh;
`;

const NewBoardWrapper = styled.div`
  display: flex;
  width: 100vw;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  height: 10vh;
`;

const Boards = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  gap: 10px;
`;

const TrashWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
`;

function App() {
  const [toDos, setToDos] = useRecoilState(toDoState);
  const onDragEnd = (info: DropResult) => {
    const { destination, draggableId, source } = info;
    if (!destination) return;
    if (info.type === "board") {
      // board movement
      setToDos((allBoards) => {
        const copiedBoard = Object.entries({ ...allBoards });
        const cutTodo = [...copiedBoard.splice(source.index, 1)];
        copiedBoard.splice(destination.index, 0, ...cutTodo);
        return {
          ...Object.fromEntries(copiedBoard),
        };
      });
    }
    // Movement of ToDos
    else if (destination?.droppableId === source.droppableId) {
      // same board movement.
      setToDos((allBoards) => {
        const boardCopy = [...allBoards[source.droppableId]];
        const taskObj = boardCopy[source.index];
        boardCopy.splice(source.index, 1);
        boardCopy.splice(destination?.index, 0, taskObj);
        return {
          ...allBoards,
          [source.droppableId]: boardCopy,
        };
      });
    } else if (destination?.droppableId === "trash") {
      setToDos((allBoards) => {
        const boardCopy = [...allBoards[source.droppableId]];
        boardCopy.splice(source.index, 1);
        return {
          ...allBoards,
          [source.droppableId]: boardCopy,
        };
      });
    } else if (destination.droppableId !== source.droppableId) {
      // cross board movement
      setToDos((allBoards) => {
        const sourceBoard = [...allBoards[source.droppableId]];
        const taskObj = sourceBoard[source.index];
        const destinationBoard = [...allBoards[destination.droppableId]];
        sourceBoard.splice(source.index, 1);
        destinationBoard.splice(destination?.index, 0, taskObj);
        return {
          ...allBoards,
          [source.droppableId]: sourceBoard,
          [destination.droppableId]: destinationBoard,
        };
      });
    }
  };
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <NewBoardWrapper>
        <NewBoard />
      </NewBoardWrapper>
      <Wrapper>
        <Droppable
          droppableId="BoardMovement"
          direction="horizontal"
          type="board"
        >
          {(magic) => (
            <Boards {...magic.droppableProps} ref={magic.innerRef}>
              {Object.keys(toDos).map((boardId, idx) => (
                <Board
                  boardId={boardId}
                  key={boardId}
                  toDos={toDos[boardId]}
                  boardNum={idx}
                />
              ))}
            </Boards>
          )}
        </Droppable>
      </Wrapper>
      <TrashWrapper>
        <TrashCan />
      </TrashWrapper>
    </DragDropContext>
  );
}

export default App;
