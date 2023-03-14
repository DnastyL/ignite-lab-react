import React, { useEffect, useState } from "react";
import { TypeForm } from "../types/TypeForm";
import classNames from "classnames";
import { LessonValuesForm } from "./LessonValuesForm";

export const Form = ({
  subscribeValues,
  setSubscribeValues,
  handleSubscribe,
  formLesson,
  children,
  teacherValues,
  setTeacherValues,
  lessonSlug,
  stageLesson,
}: TypeForm) => {
  const [instructor, setInstructor] = useState(false);

  useEffect(() => {
    if (location.pathname === "/instructor") {
      setInstructor(true);
    }
  }, [location]);



  return (
    <form
      onSubmit={handleSubscribe}
      className="flex flex-col gap-2 w-full"
      autoComplete="off"
    >
      {!formLesson ? (
        <>
          <div className="relative">
            <input
              className="peer"
              placeholder=""
              autoComplete="off"
              id="name"
              name="name"
              type="text"
              value={
                !instructor
                  ? subscribeValues?.name || ""
                  : teacherValues?.name || ""
              }
              onChange={(event) => {
                const valueReplace = event.target.value.replace(/[\d]/gm, "");
                const slug = valueReplace
                  .toLocaleLowerCase()
                  .trim()
                  .replace(/[^a-z]/gm, "-");
                !instructor
                  ? setSubscribeValues!({
                      ...subscribeValues!,
                      [event.target.name]: valueReplace,
                      ["slug"]: slug,
                    })
                  : setTeacherValues!({
                      ...teacherValues!,
                      [event.target.name]: valueReplace,
                      ["slug"]: slug,
                    });
              }}
            />
            <label
              htmlFor="name"
              className={classNames(
                "absolute bg-gray-700 rounded top-4 w-[90%] left-5 cursor-text peer-focus:max-w-max peer-focus:px-1 peer-focus:text-xs peer-focus:text-blue-500 peer-focus:-top-2 transition-all",
                {
                  "-top-2 text-xs transition-all px-1 max-w-max":
                    teacherValues?.name || subscribeValues?.name,
                }
              )}
            >
              Seu nome completo
            </label>
          </div>
          <div className="relative">
            <input
              className="peer"
              id="useremail"
              name="email"
              type="email"
              placeholder=""
              value={
                !instructor
                  ? subscribeValues?.email || ""
                  : teacherValues?.email || ""
              }
              autoComplete="off"
              onChange={(event) => {
                const { name, value } = event.target;
                !instructor
                  ? setSubscribeValues!({
                      ...subscribeValues!,
                      [name]: value,
                    })
                  : setTeacherValues!({
                      ...teacherValues!,
                      [name]: value,
                    });
              }}
            />
            <label
              htmlFor="useremail"
              className={classNames(
                "absolute bg-gray-700 rounded top-4 w-[90%] left-5 cursor-text peer-focus:max-w-max peer-focus:px-1 peer-focus:text-xs peer-focus:text-blue-500 peer-focus:-top-2 transition-all",
                {
                  "-top-2 text-xs transition-all px-1 max-w-max":
                    teacherValues?.email || subscribeValues?.email,
                }
              )}
            >
              Digite seu email
            </label>
          </div>
        </>
      ) : (
        <LessonValuesForm lessonSlug={lessonSlug} stageLesson={stageLesson!} />
      )}

      {children}
    </form>
  );
};
