"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { successNotify } from "@/helpers/toastifyHlp";
import { deleteJournal } from "@/actions/journal";

type Props = {
  id: string;
  closeModal: () => void;
};

function DeleteModal({ id, closeModal }: Props) {
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation({
    mutationFn: deleteJournal,
    onSuccess: () => {
      successNotify("Journal deleted successfully");
      queryClient.invalidateQueries(["journals"]); 
      queryClient.invalidateQueries(["my-journals"]); 
      closeModal();
    },
  });

  const onConfirm = () => {
    mutate(id);
  };

  return (
    <div className="fixed bg-black/50 w-full h-full z-20 left-0 top-0">
      <div className="absolute bg-white top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-12 rounded-lg flex flex-col gap-6">
        <h2 className="text-xl font-medium">
          Are you sure you want to delete this journal? 😥
        </h2>

        <h3 className="text-red-600 text-sm">
          It will permanently delete your journal and related comments.
        </h3>

        <div className="flex justify-between gap-4">
          <button
            onClick={closeModal}
            disabled={isLoading}
            className="w-32 py-2 px-4 text-sm bg-slate-200 hover:bg-slate-300"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="w-32 py-2 px-4 text-sm bg-red-500 text-white hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteModal;
