import { useForm } from "react-hook-form";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { toDoState } from "../atoms";

const Form = styled.form`
  width: 100%;
  input {
    width: 50%;
  }
`;

const FormField = styled.input`
  padding: 12px 20px;
  margin: auto;
  box-sizing: border-box;
  display: flex;
`;

interface IForm {
  boardName: string;
}

function NewBoard() {
  const setToDos = useSetRecoilState(toDoState);
  const { register, setValue, handleSubmit } = useForm<IForm>();
  const onValid = ({ boardName }: IForm) => {
    const newBoard = {
      [boardName]: [],
    };
    setToDos((allBoards) => {
      console.log(allBoards);
      console.log(newBoard);
      return {
        ...allBoards,
        ...newBoard,
      };
    });
    // setValue("toDo", "");
  };
  return (
    <Form onSubmit={handleSubmit(onValid)}>
      <FormField
        placeholder="Input Board Name"
        {...register("boardName", { required: true })}
        type="text"
      />
    </Form>
  );
}

export default NewBoard;
