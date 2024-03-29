import React, { createContext, ReactNode, useState } from "react";
import { TypeLesson } from "../types/TypeLesson";

type sessionStorageValues = {
  name: string;
  email: string;
  slug: string;
};
type ContextType = {
  timeline: boolean;
  setTimeline: React.Dispatch<React.SetStateAction<boolean>>;
  setTriggerTeacherLessons: React.Dispatch<React.SetStateAction<boolean>>;
  triggerTeacherLessons: boolean;
  lessonValues: TypeLesson;
  setLessonValues: React.Dispatch<React.SetStateAction<TypeLesson>>;
  apiTarget: string | undefined;
  setApiTarget: React.Dispatch<React.SetStateAction<string | undefined>>;
  sessionStorageTeacher: sessionStorageValues;
  setSessionStorageTeacher: React.Dispatch<React.SetStateAction<sessionStorageValues>>;
  sessionStorageSubscriber: sessionStorageValues;
  setSessionStorageSubscriber: React.Dispatch<React.SetStateAction<sessionStorageValues>>;
  handleSubmitUserInSessionStorage: (name: string, email: string, slug: string, isSubscriber: boolean) => void;
};

type ContextProviderTpe = {
  children: ReactNode;
};

export const Context = createContext({} as ContextType);

export const ContextProvider = (props: ContextProviderTpe) => {
  const [timeline, setTimeline] = useState(false);
  const [triggerTeacherLessons, setTriggerTeacherLessons]= useState(false);
  const [lessonValues, setLessonValues] = useState<TypeLesson>(
    {} as TypeLesson
  );
  const [sessionStorageTeacher, setSessionStorageTeacher] = useState<sessionStorageValues>(() => {
    const sessionStorageValues = sessionStorage.getItem("teacher");
    return sessionStorageValues ? JSON.parse(sessionStorageValues) : false;
  });

  const [sessionStorageSubscriber, setSessionStorageSubscriber] = useState<sessionStorageValues>(() => {
    const sessionStorageValues = sessionStorage.getItem("subscriber");
    return sessionStorageValues ? JSON.parse(sessionStorageValues) : false;
  });
  const [apiTarget, setApiTarget] = useState<string | undefined>();

  function handleSubmitUserInSessionStorage(
    name: string,
    email: string,
    slug: string,
    isSubscriber: boolean
  ) {
    const teacherObject = {
      name: name,
      email: email,
      slug: slug,
    };
    if (!isSubscriber) {
      if(sessionStorageTeacher){
        sessionStorage.removeItem("teacher");
      }
      setSessionStorageTeacher(teacherObject);
      sessionStorage.setItem("teacher", JSON.stringify(teacherObject));
    } else {
      if(sessionStorageSubscriber){
        sessionStorage.removeItem("subscriber")
      }
      setSessionStorageSubscriber(teacherObject);
      sessionStorage.setItem("subscriber", JSON.stringify(teacherObject));
    }
  }



  return (
    <Context.Provider
      value={{
        timeline,
        setTimeline,
        lessonValues,
        setLessonValues,
        apiTarget,
        setApiTarget,
        sessionStorageTeacher,
        setSessionStorageTeacher,
        sessionStorageSubscriber,
        setSessionStorageSubscriber,
        handleSubmitUserInSessionStorage,
        setTriggerTeacherLessons,
        triggerTeacherLessons,
      }}
    >
      {props.children}
    </Context.Provider>
  );
};
