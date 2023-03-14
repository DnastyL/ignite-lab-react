import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ModalCreateLesson } from "../components/ModalCreateLesson";
import { ModalUpdateLesson } from "../components/ModalUpdateLesson";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { Video } from "../components/Video";
import { Stage, useGetTeacherBySlugQuery } from "../graphql/generated";
import { useContextValues } from "../hooks/useContext";

export const Event = () => {
  const { subscriber } = useParams<{ subscriber: string }>();
  const { lessonSlug } = useParams<{ lessonSlug: string }>();
  const { teacherSlug } = useParams<{ teacherSlug: string }>();
  const navigate = useNavigate();
  const { timeline, sessionStorageTeacher, sessionStorageSubscriber } =
    useContextValues();
  const [formLesson, setFormLesson] = useState(false);
  const [updateLesson, setUpdateLesson] = useState(false);
  const [deleteLesson, setDeleteLesson] = useState(false);
  const [submitLesson, setSubmitLesson] = useState(false);
  const [stageLesson] = useState<Stage>(Stage.Draft);

  const { data } = useGetTeacherBySlugQuery({
    variables: {
      slug: teacherSlug,
    },
  });

  useEffect(() => {
    if (teacherSlug || subscriber) {
      verifiyRoute();
    }
  }, [data]);

  const verifiyRoute = useCallback(() => {
    if (teacherSlug) {
      const teacher = teacherSlug != sessionStorageTeacher.slug;
      if (teacher) {
        return navigate("/");
      }
    } else {
      if (subscriber != sessionStorageSubscriber.slug) {
        return navigate("/");
      }
    }
  }, [teacherSlug, sessionStorageTeacher]);


  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex flex-1">
        {!timeline && (
          <Video lessonSlug={lessonSlug} stageLesson={stageLesson} />
        )}

        <ModalCreateLesson
          teacherSlug={teacherSlug as string}
          formLesson={formLesson}
          setFormLesson={setFormLesson}
        />
        <ModalUpdateLesson
          isOpenUpdateLesson={updateLesson}
          isOpenDeleteLesson={deleteLesson}
          isOpenSubmitLesson={submitLesson}
          setIsOpenDeleteLesson={setDeleteLesson}
          setIsOpenSubmitLesson={setSubmitLesson}
          setIsOpenUpdateLesson={setUpdateLesson}
          teacherSlug={teacherSlug as string}
          lessonSlug={lessonSlug as string}
          stageLesson={stageLesson}
        />
        <Sidebar
          teacherSlug={teacherSlug}
          teacherId={data?.teacher?.id}
          formLesson={formLesson}
          setSubmitLesson={setSubmitLesson}
          setFormLesson={setFormLesson}
          setDeleteLesson={setDeleteLesson}
          setUpdateLesson={setUpdateLesson}
        />
      </main>
    </div>
  );
};
