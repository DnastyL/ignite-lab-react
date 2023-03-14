import { X } from "phosphor-react";
import React, { FormEvent, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Stage,
  useDeleteLessonMutation,
  usePublishLessonMutation,
  useUpdateLessonMutation,
} from "../graphql/generated";
import { Button } from "./Button";
import { closeModal } from "../hooks/useCloseModal";
import { useContextValues } from "../hooks/useContext";
import { Form } from "./Form";
import { TypeLesson } from "../types/TypeLesson";

type ModalUpdateLessonType = {
  isOpenDeleteLesson: boolean;
  isOpenSubmitLesson: boolean;
  isOpenUpdateLesson: boolean;
  setIsOpenUpdateLesson: React.Dispatch<React.SetStateAction<boolean>>;
  setIsOpenDeleteLesson: React.Dispatch<React.SetStateAction<boolean>>;
  setIsOpenSubmitLesson: React.Dispatch<React.SetStateAction<boolean>>;
  teacherSlug: string;
  lessonSlug: string;
  stageLesson: Stage;
};

export const ModalUpdateLesson = ({
  isOpenDeleteLesson,
  isOpenSubmitLesson,
  isOpenUpdateLesson,
  setIsOpenDeleteLesson,
  setIsOpenSubmitLesson,
  setIsOpenUpdateLesson,
  teacherSlug,
  lessonSlug,
  stageLesson,
}: ModalUpdateLessonType) => {
  const {
    lessonValues,
    setLessonValues,
    setTriggerTeacherLessons,
    triggerTeacherLessons,
  } = useContextValues();
  const navigate = useNavigate();
  const ref = useRef(null);
  const [deleteLesson, { loading: deleteLoading }] = useDeleteLessonMutation();
  const [publishLesson, { loading: publishLoading }] =
    usePublishLessonMutation();
  const [updateLesson, { loading }] = useUpdateLessonMutation();

  useEffect(() => {
    if (isOpenDeleteLesson || isOpenSubmitLesson || isOpenUpdateLesson) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [isOpenDeleteLesson, isOpenSubmitLesson, isOpenUpdateLesson]);

  if (!isOpenDeleteLesson && !isOpenSubmitLesson && !isOpenUpdateLesson) {
    return <></>;
  }

  async function deleteLessonSelected() {
    try {
      await deleteLesson({
        variables: {
          slug: lessonSlug,
        },
      });
      setIsOpenDeleteLesson(!isOpenDeleteLesson);
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
      setIsOpenSubmitLesson(!isOpenSubmitLesson);
      navigate(`/instructor/event/${teacherSlug}`);
    } 
    catch (error) {
      throw new Error(`Failed to publish lesson ${error}`);
    }
  }

  async function handleUpdateLessonValues(event: FormEvent) {
    event.preventDefault();
    try {
      await updateLesson({
        variables: {
          slug: lessonSlug,
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
        setIsOpenUpdateLesson(false);
        setTriggerTeacherLessons(!triggerTeacherLessons);
        navigate(`/instructor/event/${teacherSlug}`);
      });
    } catch (error) {
      console.log("Failed to update Lesson " + error);
    }
  }

  return (
    <div
      className="flex items-center justify-center fixed inset-0 bg-black bg-opacity-50 z-[9999]"
      ref={ref}
      onClick={(event) => {
        const isClose = isOpenDeleteLesson
          ? setIsOpenDeleteLesson
          : isOpenSubmitLesson
          ? setIsOpenSubmitLesson
          : setIsOpenUpdateLesson;

        if (event.target === ref.current) {
          setLessonValues({} as TypeLesson);
        }

        closeModal({ event, ref, isClose });
      }}
    >
      <div className="p-8 bg-gray-700 border border-gray-500 rounded relative">
        {isOpenDeleteLesson && !isOpenSubmitLesson && !isOpenUpdateLesson && (
          <>
            <h2>Tem certeza que deseja excluir a aula?</h2>
            <div className="flex justify-between">
              <span>
                <Button onClick={deleteLessonSelected}>Sim</Button>
              </span>
              <span>
                <Button
                  onClick={() => setIsOpenDeleteLesson(!isOpenDeleteLesson)}
                >
                  Não
                </Button>
              </span>
            </div>
            <span
              className="absolute right-[8px] top-[8px] hover:cursor-pointer"
              onClick={() => setIsOpenDeleteLesson(!isOpenDeleteLesson)}
            >
              <X size={24} />
            </span>
          </>
        )}
        {isOpenSubmitLesson && !isOpenDeleteLesson && !isOpenUpdateLesson && (
          <>
            <h2>Tem certeza que deseja publicar a lição?</h2>
            <div className="flex justify-between">
              <span>
                <Button onClick={publishLessonSelected}>Sim</Button>
              </span>
              <span>
                <Button
                  onClick={() => setIsOpenSubmitLesson(!isOpenSubmitLesson)}
                >
                  Não
                </Button>
              </span>
            </div>
            <span
              className="absolute right-[8px] top-[8px] hover:cursor-pointer"
              onClick={() => setIsOpenSubmitLesson(!isOpenSubmitLesson)}
            >
              <X size={24} />
            </span>
          </>
        )}
        {isOpenUpdateLesson && !isOpenDeleteLesson && !isOpenSubmitLesson && (
          <>
            <div className="p-3">
              <strong className="text-2xl m-6 block">
                Atualizar Aula no{" "}
                <strong className="text-green-500">Ignite-Lab</strong>
              </strong>
            </div>
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
                setIsOpenUpdateLesson(false);
                setLessonValues({} as TypeLesson);
              }}
            >
              <X size={24} />
            </span>
          </>
        )}
      </div>
    </div>
  );
};
