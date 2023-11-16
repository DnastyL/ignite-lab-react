type mTitle = {
  children: React.ReactNode;
};

export const ModalTitle = ({ children }: mTitle) => {
  return (
    <div className="p-3">
      <strong className="text-2xl m-6 block">
        {/* {Atualizar Aula no <strong className="text-green-500">Ignite-Lab</strong>} */}
        {children}
      </strong>
    </div>
  );
};
