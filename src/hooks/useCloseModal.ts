// import { MouseEvent } from "react";

// type closeModalType = {
//     event: MouseEvent<HTMLDivElement, globalThis.MouseEvent>;
//     ref:  React.MutableRefObject<null>
//     isClose: React.Dispatch<React.SetStateAction<boolean>>;
// }

// export function closeModal({event, ref, isClose}: closeModalType ) {
//     if (ref.current === event.target) {
//      return isClose(false);
//     }
//   }

type closeModalType = {
    isModal: boolean | undefined;
    setIsModal: React.Dispatch<React.SetStateAction<boolean>> | undefined;
}

export function closeModal({isModal, setIsModal}: closeModalType ): void {
    if(isModal && setIsModal){
        return setIsModal(false)
    }
  }
