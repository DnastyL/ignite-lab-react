import { PaperPlaneRight, SignOut } from "phosphor-react";
import { useEffect, useState } from "react";
import {
  useGetLessonByTeacherLazyQuery,
  useGetLessonsLazyQuery,
} from "../graphql/generated";
import { useContextValues } from "../hooks/useContext";
import { Button } from "./Button";
import { Lesson } from "./Lesson";
import classNames from "classnames";
import { useNavigate } from "react-router-dom";
import { TypeModalAction } from "../types/TypeModalAction";

type SiderbarType = {
  teacherSlug: string | undefined;
  teacherId: string | undefined;
  formLesson: boolean;
  setFormLesson: React.Dispatch<React.SetStateAction<boolean>>;
  setIsModalAction: React.Dispatch<React.SetStateAction<TypeModalAction>>;
  setUpdateLesson: React.Dispatch<React.SetStateAction<boolean>>;
};

export const Sidebar = ({
  teacherSlug,
  teacherId,
  formLesson,
  setFormLesson,
  setIsModalAction,
  setUpdateLesson,
}: SiderbarType) => {
  const [fetchLessons, { data }] = useGetLessonsLazyQuery();
  const [fetchTeacherLessons, { data: lessonTeacherData, fetchMore }] =
    useGetLessonByTeacherLazyQuery({
      variables: {
        id: teacherId,
      },
    });
  const [buttonActive, setButtonActive] = useState(false);
  const {
    timeline,
    triggerTeacherLessons,
    sessionStorageSubscriber,
    sessionStorageTeacher,
  } = useContextValues();
  const navigate = useNavigate();

  useEffect(() => {
    if (teacherSlug && teacherId) {
      fetchTeacherLessons({
        variables: {
          id: teacherId,
        },
      });

      fetchMore({
        variables: {
          id: teacherId,
        },
      });
    } else {
      fetchLessons();
    }
  }, [triggerTeacherLessons, teacherSlug, teacherId]);

  function handleSignOut() {
    if (window.confirm("Tem certeza que deseja se desconectar?")) {
      if (sessionStorageSubscriber) {
        sessionStorage.removeItem("subscriber");
      }
      if (sessionStorageTeacher) {
        sessionStorage.removeItem("teacher");
      }
      return navigate(`/`);
    }
  }

  return (
    <aside
      className={
        !timeline
          ? "w-[348px] bg-gray-700 p-6 border-l border-gray-600 lgx:max-w-[250px] sm:hidden"
          : "w-full bg-gray-700 p-6 border-l border-gray-600 sm:block"
      }
    >
      <span className="font-bold text-2xl lgx:text-xl pb-6 mb-6 border-b border-gray-500 flex items-center justify-between">
        {teacherSlug ? "Suas aulas: " : "Cronograma de Aulas"}
        <span className="hover:cursor-pointer" onClick={handleSignOut}>
          <SignOut size={20} />
        </span>
      </span>
      <div className="flex flex-col gap-12">
        <div className="flex flex-col gap-8">
          {!teacherSlug
            ? data?.lessons.map((lesson) => {
                return (
                  <Lesson
                    key={lesson.id}
                    title={lesson.title}
                    slug={lesson.slug}
                    avalaibleAt={new Date(lesson.availableAt)}
                    type={lesson.lessonType}
                  />
                );
              })
            : lessonTeacherData?.lessons.map((lesson) => {
                return (
                  <Lesson
                    key={lesson.id}
                    title={lesson.title}
                    slug={lesson.slug}
                    avalaibleAt={new Date(lesson.availableAt)}
                    type={lesson.lessonType}
                    teacherSlug={teacherSlug}
                    setFormLesson={setFormLesson}
                    setButtonActive={setButtonActive}
                    setIsModalAction={setIsModalAction}
                    setUpdateLesson={setUpdateLesson}
                  />
                );
              })}
        </div>
        {teacherSlug && (
          <div
            className={
              !timeline
                ? "w-[300px] flex items-center gap-8 lgx:max-w-full lgx:gap-4"
                : " w-full flex items-center gap-3 "
            }
          >
            <span
              className={
                !timeline
                  ? "max-w-[234px] min-w-[200px] lgx:min-w-[130px]"
                  : "w-full "
              }
            >
              <Button disabled={formLesson} onClick={() => setFormLesson(true)}>
                Adicionar Aula
              </Button>
            </span>
            <span
              className={classNames(
                "flex bg-green-500 w-[60px] h-[60px] mt-3 items-center justify-center rounded-full hover:cursor-pointer",
                {
                  "opacity-60 hover:cursor-not-allowed": !buttonActive,
                }
              )}
              onClick={() => buttonActive && setIsModalAction({isModalDelete: false, isModalSubmit: true})}
            >
              <PaperPlaneRight size={28} />
            </span>
          </div>
        )}
      </div>
    </aside>
  );
};
