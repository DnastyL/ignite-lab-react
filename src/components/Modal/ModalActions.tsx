import { X } from "phosphor-react";
import { useNavigate } from "react-router-dom";
import {
  useDeleteLessonMutation,
  usePublishLessonMutation,
} from "../../graphql/generated";
import { useContextValues } from "../../hooks/useContext";
import { TypeModalAction } from "../../types/TypeModalAction";
import { Button } from "../Button";

type mActionsType = {
  isModalDelete: boolean | undefined;
  isModalSubmit: boolean | undefined;
  lessonSlug: string;
  teacherSlug: string;
  setIsOpen: React.Dispatch<React.SetStateAction<TypeModalAction>>;
};

export const ModalActions = ({
  teacherSlug,
  lessonSlug,
  setIsOpen,
  isModalDelete,
  isModalSubmit,
}: mActionsType) => {
  const navigate = useNavigate();
  const { setTriggerTeacherLessons, triggerTeacherLessons } =
    useContextValues();
  const [deleteLesson] = useDeleteLessonMutation();
  const [publishLesson] = usePublishLessonMutation();

  async function deleteLessonSelected() {
    try {
      await deleteLesson({
        variables: {
          slug: lessonSlug,
        },
      });
      setIsOpen({ isModalDelete: false, isModalSubmit: false });
      setTriggerTeacherLessons(!triggerTeacherLessons);
      navigate(`/instructor/event/${teacherSlug}`);
    } catch (error) {
      throw new Error(`Failed to delete lesson ${error}`);
    }
  }

  async function publishLessonSelected() {
    try {
      await publishLesson({
        variables: {
          slug: lessonSlug,
        },
      });
      setIsOpen({ isModalDelete: false, isModalSubmit: false });
      navigate(`/instructor/event/${teacherSlug}`);
    } catch (error) {
      throw new Error(`Failed to publish lesson ${error}`);
    }
  }
  return (
    <>
      {isModalDelete && (
        <>
          <h2>Tem certeza que deseja excluir a aula?</h2>
          <div className="flex justify-between">
            <span>
              <Button onClick={deleteLessonSelected}>Sim</Button>
            </span>
            <span>
              <Button
                onClick={() =>
                  setIsOpen({ isModalDelete: false, isModalSubmit: false })
                }
              >
                Não
              </Button>
            </span>
          </div>
          <span
            className="absolute right-[8px] top-[8px] hover:cursor-pointer"
            onClick={() =>
              setIsOpen({ isModalDelete: false, isModalSubmit: false })
            }
          >
            <X size={24} />
          </span>
        </>
      )}
      {isModalSubmit && (
        <>
          <h2>Tem certeza que deseja publicar a lição?</h2>
          <div className="flex justify-between">
            <span>
              <Button onClick={publishLessonSelected}>Sim</Button>
            </span>
            <span>
              <Button
                onClick={() =>
                  setIsOpen({ isModalDelete: false, isModalSubmit: false })
                }
              >
                Não
              </Button>
            </span>
          </div>
          <span
            className="absolute right-[8px] top-[8px] hover:cursor-pointer"
            onClick={() =>
              setIsOpen({ isModalDelete: false, isModalSubmit: false })
            }
          >
            <X size={24} />
          </span>
        </>
      )}
    </>
  );
};
