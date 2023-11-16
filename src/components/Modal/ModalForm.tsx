import { X } from "phosphor-react";
import React, { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  Stage,
  useCreateLessonMutation,
  useUpdateLessonMutation,
} from "../../graphql/generated";
import { useContextValues } from "../../hooks/useContext";
import { TypeLesson } from "../../types/TypeLesson";
import { Button } from "../Button";
import { Form } from "../Form";
import { closeModal } from "../../hooks/useCloseModal";

type mContent = {
  isModalCreate: boolean | undefined;
  setIsModalCreate: React.Dispatch<React.SetStateAction<boolean>> | undefined; 
  isModalUpdate: boolean | undefined;
  setIsModalUpdate: React.Dispatch<React.SetStateAction<boolean>> | undefined;
  lessonSlug: string;
  stageLesson: Stage;
  teacherSlug: string;
};
export const ModalForm = ({
  isModalCreate,
  isModalUpdate,
  setIsModalCreate,
  setIsModalUpdate,
  lessonSlug,
  stageLesson,
  teacherSlug,
}: mContent) => {
  const {
    lessonValues,
    setLessonValues,
    triggerTeacherLessons,
    setTriggerTeacherLessons,
  } = useContextValues();
  const [updateLesson] = useUpdateLessonMutation();
  const [createLesson, { loading }] = useCreateLessonMutation();
  const navigate = useNavigate();

  async function handleUpdateLessonValues(event: FormEvent) {
    event.preventDefault();
    const isModal = isModalUpdate;
    const setIsModal = setIsModalUpdate;

    try {
      await updateLesson({
        variables: {
          slug: lessonSlug!,
          availableAt: lessonValues.availableAt,
          description: !lessonValues.description
            ? undefined
            : lessonValues.description,
          lessonType: !lessonValues.lessonType
            ? undefined
            : lessonValues.lessonType,
          title: !lessonValues.title ? undefined : lessonValues.title,
          newSlug: !lessonValues.slug ? undefined : lessonValues.slug,
          videoId: !lessonValues.videoId ? undefined : lessonValues.videoId,
        },
      }).then(() => {
        closeModal({ isModal, setIsModal });
        setTriggerTeacherLessons(!triggerTeacherLessons);
        navigate(`/instructor/event/${teacherSlug}`);
      });
    } catch (error) {
      throw new Error("Failed to update Lesson " + error);
    }
  }

  async function handleSubscribeLesson(event: FormEvent) {
    event.preventDefault();
    const isModal = isModalCreate;
    const setIsModal = setIsModalCreate;
    try {
      await createLesson({
        variables: {
          title: lessonValues.title,
          slug: lessonValues.slug,
          videoId: lessonValues.videoId,
          lessonType: lessonValues.lessonType,
          description: lessonValues.description,
          teacherSlug: teacherSlug,
          availableAt: lessonValues.availableAt,
        },
      });
      closeModal({ isModal, setIsModal });
      navigate(`instructor/event/${teacherSlug}`);
    } catch (error: any) {
      throw new Error(error);
    }
  }

  return (
    <>
      {isModalUpdate && (
        <>
          <Form
            handleSubscribe={handleUpdateLessonValues}
            formLesson={true}
            stageLesson={stageLesson}
            lessonSlug={lessonSlug}
          >
            {
              <Button
                type="submit"
                disabled={
                  (!lessonValues.availableAt &&
                    !lessonValues.description &&
                    !lessonValues.lessonType &&
                    !lessonValues.title &&
                    !lessonValues.videoId) ||
                  !lessonSlug
                }
              >
                Atualizar Aula
              </Button>
            }
          </Form>
          <span
            className="absolute right-[24px] top-[24px] hover:cursor-pointer"
            onClick={() => {
              setLessonValues({} as TypeLesson);
              return setIsModalUpdate!(false);
            }}
          >
            <X size={24} />
          </span>
        </>
      )}
      {isModalCreate && (
        <>
          <Form handleSubscribe={handleSubscribeLesson} formLesson={true}>
            {
              <Button
                type="submit"
                disabled={
                  !lessonValues.availableAt ||
                  !lessonValues.description ||
                  !lessonValues.title ||
                  !lessonValues.videoId ||
                  !lessonValues.lessonType ||
                  loading
                }
              >
                Cadastrar Aula
              </Button>
            }
          </Form>
          <span
            className="absolute right-[24px] top-[24px] hover:cursor-pointer"
            onClick={() => {
              setLessonValues({} as TypeLesson);
              return setIsModalCreate!(false);
            }}
          >
            <X size={24} />
          </span>
        </>
      )}
    </>
  );
};
