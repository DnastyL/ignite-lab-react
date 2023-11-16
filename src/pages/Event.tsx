import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Modal } from "../components/Modal/Index";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { Video } from "../components/Video";
import { Stage, useGetTeacherBySlugQuery } from "../graphql/generated";
import { useContextValues } from "../hooks/useContext";
import { TypeModalAction } from "../types/TypeModalAction";

export const Event = () => {
  const { subscriber } = useParams<{ subscriber: string }>();
  const { lessonSlug } = useParams<{ lessonSlug: string }>();
  const { teacherSlug } = useParams<{ teacherSlug: string }>();
  const navigate = useNavigate();
  const { timeline, sessionStorageTeacher, sessionStorageSubscriber } =
    useContextValues();
  const [formLesson, setFormLesson] = useState(false);
  const [updateLesson, setUpdateLesson] = useState(false);
  const [isModalAction, setIsModalAction] = useState<TypeModalAction>(
    {} as TypeModalAction
  );
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
        
        {/*before using composition pattern}
        
      {/* <ModalCreateLesson
      teacherSlug={teacherSlug as string}
      formLesson={formLesson}
      setFormLesson={setFormLesson}/>
                                  
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
    /> */}

        <Modal.Root
          isModalCreate={formLesson}
          isModalUpdate={updateLesson}
          setIsModalUpdateOpen={setUpdateLesson}
          setIsModalCreateOpen={setFormLesson}
        >
          <Modal.Title>
            {updateLesson
              ? `Atualizar Aula no `
              : `Cadastre sua Aula no `}
            <strong className="text-green-500">Ignite-Lab</strong>
          </Modal.Title>

          <Modal.Form
            isModalCreate={formLesson}
            setIsModalCreate={setFormLesson}
            isModalUpdate={updateLesson}
            setIsModalUpdate={setUpdateLesson}
            teacherSlug={teacherSlug as string}
            lessonSlug={lessonSlug as string}
            stageLesson={stageLesson}
          />
        </Modal.Root>

        <Modal.Root
          isModalAction={isModalAction}
          setIsModalAction={setIsModalAction}
        >
          <Modal.Actions
            isModalDelete={isModalAction?.isModalDelete}
            isModalSubmit={isModalAction.isModalSubmit}
            lessonSlug={lessonSlug as string}
            teacherSlug={teacherSlug as string}
            setIsOpen={setIsModalAction}
          ></Modal.Actions>
        </Modal.Root>

        <Sidebar
          teacherSlug={teacherSlug}
          teacherId={data?.teacher?.id}
          formLesson={formLesson}
          setFormLesson={setFormLesson}
          setIsModalAction={setIsModalAction}
          setUpdateLesson={setUpdateLesson}
        />
      </main>
    </div>
  );
};
