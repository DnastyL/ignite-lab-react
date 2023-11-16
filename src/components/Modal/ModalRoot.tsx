import { useEffect, useRef, useState } from "react";
import { useContextValues } from "../../hooks/useContext";
import { TypeLesson } from "../../types/TypeLesson";
import { TypeModalAction } from "../../types/TypeModalAction";

type mRoot = {
  children: React.ReactNode;
  isModalCreate?: boolean;
  isModalAction?: TypeModalAction;
  isModalUpdate?: boolean;
  setIsModalCreateOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  setIsModalUpdateOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  setIsModalAction?: React.Dispatch<React.SetStateAction<TypeModalAction>>;
};

export const ModalRoot = ({
  children,
  isModalCreate,
  isModalUpdate,
  isModalAction,
  setIsModalCreateOpen,
  setIsModalUpdateOpen,
  setIsModalAction,
}: mRoot) => {
  const ref = useRef(null);
  const { setLessonValues } = useContextValues();
  const closeModal = () => {
    if (!isModalCreate && isModalUpdate && setIsModalUpdateOpen) {
      return setIsModalUpdateOpen(false);
    }
    if (!isModalUpdate && isModalCreate && setIsModalCreateOpen) {
      return setIsModalCreateOpen(false);
    } else {
      return setIsModalAction!({ isModalDelete: false, isModalSubmit: false });
    }
  };


  useEffect(() => {
    if (
      isModalCreate ||
      isModalUpdate ||
      isModalAction?.isModalDelete ||
      isModalAction?.isModalSubmit
    ) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [isModalCreate, isModalUpdate, isModalAction]);

  if (
    !isModalCreate &&
    !isModalUpdate &&
    !isModalAction?.isModalDelete &&
    !isModalAction?.isModalSubmit
  ) {
    return <></>;
  }

  return (
    <div
      ref={ref}
      onClick={(event) => {
        if (ref.current === event.target) {
          setLessonValues({} as TypeLesson);
          closeModal();
        }
      }}
      className="flex items-center justify-center fixed inset-0 bg-black bg-opacity-50 z-[9999]"
    >
      <div className="p-8 bg-gray-700 border border-gray-500 rounded relative smll:w-full smll:h-full">
        {children}
      </div>
    </div>
  );
};
