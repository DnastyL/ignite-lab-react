import { useState } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Stage, useGetLessonBySlugQuery } from "../graphql/generated";
import { useContextValues } from "../hooks/useContext";
import { LessonType } from "../types/TypeLesson";

type typeLessonValues = {
  lessonSlug: string | undefined;
  stageLesson: Stage | undefined;
};

export const LessonValuesForm = ({
  lessonSlug,
  stageLesson,
}: typeLessonValues) => {
  const { lessonValues, setLessonValues } = useContextValues();

  const [formDate, setFormDate] = useState(new Date());

  const { data } = useGetLessonBySlugQuery({
    variables: {
      slug: lessonSlug,
      stage: stageLesson !== undefined ? stageLesson : Stage.Draft,
    },
  });

  function handleOnChange(
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) {
    const { name, value } = event.target;

    if (name == "title") {
      const valueReplaced = value.replace(/^[\s]/g, "");
      const lessonSlugValue = valueReplaced
        .toLocaleLowerCase().trim()
        .replace(/[\s]/gm, "-");
      return setLessonValues({
        ...lessonValues,
        [name]: valueReplaced,
        slug: lessonSlugValue,
      });
    }

    if (name === "description") {
      const valueReplaced = value.replace(/^[\s]/g, "");
      return setLessonValues({ ...lessonValues, [name]: valueReplaced });
    }

    if (name == "lessonType") {
      if (value == "live" || value == "class") {
        let valueReplaced;
        value == "class"
          ? (valueReplaced = LessonType.Class)
          : (valueReplaced = LessonType.Live);
        return setLessonValues({ ...lessonValues, [name]: valueReplaced });
      }
    }
    if (name == "videoId") {
      const valueReplaced = value.replace(/[\s]/gi, "");
      return setLessonValues({ ...lessonValues, [name]: valueReplaced });
    }
  }

  function formatDate(date: Date, name: string) {
    let tzoffset = new Date().getTimezoneOffset() * 60000; //diferença de horário local com o horário UTC in milliseconds

    //pega o horário selecionado no form, subtrai pela diferença em milisegundos e converte para uma string no formato ISO 8601
    let localISOTime = new Date(date.getTime() - tzoffset).toISOString();

    setFormDate(date);
    return setLessonValues({ ...lessonValues, [name]: localISOTime });
  }
 

  return (
    <>
      {lessonSlug && stageLesson ? (
        <label className="text-sm font-semibold">Titulo da Aula</label>
      ) : null}
      <input
        className="bg-gray-900 rounded px-5 h-14 transition duration-200 outline-none  border-opacity-5"
        type="text"
        name="title"
        value={lessonValues.title || ""}
        placeholder={data?.lesson?.title || "Digite o titulo da aula"}
        onChange={handleOnChange}
      />
      {!lessonValues.title && !lessonSlug && (
        <span className="text-red-800">Título indefinido</span>
      )}
      {lessonSlug && stageLesson ? (
        <label className="text-sm font-semibold">ID do Video</label>
      ) : null}
      <input
        className="bg-gray-900 rounded px-5 h-14 focus:border-blue-500 transition duration-200 outline-none  border-opacity-5"
        type="text"
        name="videoId"
        autoComplete="off"
        value={lessonValues.videoId || ""}
        placeholder={data?.lesson?.videoId || "Video ID (YouTube)"}
        maxLength={11}
        onChange={handleOnChange}
      />
      {!lessonValues.videoId && !lessonSlug && (
        <span className="text-red-800">ID do video indefinido</span>
      )}
      {lessonSlug && stageLesson ? (
        <label className="text-sm font-semibold">Descrição da Aula</label>
      ) : null}
      <input
        className="bg-gray-900 border-none rounded px-5 h-14 focus:border-blue-500 transition duration-200 outline-none border-opacity-5"
        type="text"
        name="description"
        autoComplete="off"
        value={lessonValues.description || ""}
        placeholder={data?.lesson?.description || "Descrição da Aula"}
        onChange={handleOnChange}
      />
      {!lessonValues.description && !lessonSlug && (
        <span className="text-red-800">Descrição da aula indefinida</span>
      )}
      <div className="flex flex-col gap-2 pt-2">
        <label className="text-sm font-semibold">Escolha o tipo da Aula:</label>
        <select
          name="lessonType"
          className="bg-gray-700 outline-none rounded border-2 border-black border-opacity-50 appearance-none px-5 h-12"
          value={lessonValues.lessonType}
          onChange={handleOnChange}
        >
          <option value="0"></option>
          <option value="live">live</option>
          <option value="class">class</option>
        </select>
      </div>
      <div className="flex flex-col gap-2 pt-2">
        <label className="text-sm font-semibold">
          Disponibilização do Video:
        </label>
        <ReactDatePicker
          name="availableAt"
          selected={formDate}
          placeholderText="16/08/2022,14:30"
          onChange={(date: Date) => formatDate(date, "availableAt")}
          showTimeSelect
          id="availableDate"
          dateFormat="dd/MM/yyyy"
        />
        {!lessonValues.availableAt && !lessonSlug && (
          <span className="text-red-800">Data Indefinida</span>
        )}
      </div>
    </>
  );
};
